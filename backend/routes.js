const secret = 'covidPlannerDB';
const cookieName = 'cvdPlnrDt';
const pool = require('./db');
const crypto = require('crypto');
const { json } = require('body-parser');
const manager = require('./routes/manager');
const employee = require('./routes/employee');
const custodian = require('./routes/custodian');
const office = require('./routes/office');
const clocking = require('./routes/clocking');
const reservations = require('./routes/reservations');
const rooms = require('./routes/rooms');

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

  // POST /reset
  app.post('/reset', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('drop table if exists test_table', function (err, rows, fields) {
          if (err) {
            // if there is an error with the query, release the connection instance and log the error
            connection.release();
            logger.error('Problem dropping the table test_table: ', err);
            res.status(400).send('Problem dropping the table');
          } else {
            // if there is no error with the query, execute the next query and do not release the connection yet
            connection.query(
              'CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);',
              function (err, rows, fields) {
                if (err) {
                  // if there is an error with the query, release the connection instance and log the error
                  connection.release();
                  logger.error('Problem creating the table test_table: ', err);
                  res.status(400).send('Problem creating the table');
                } else {
                  // if there is no error with the query, release the connection instance
                  connection.release();
                  res.status(200).send('created the table');
                }
              }
            );
          }
        });
      }
    });
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(
          "INSERT INTO `db`.`test_table` (`value`) VALUES('" + req.body.product + "')",
          function (err, rows, fields) {
            connection.release();
            if (err) {
              // if there is an error with the query, log the error
              logger.error('Problem inserting into test table: \n', err);
              res.status(400).send('Problem inserting into table');
            } else {
              res.status(200).send(`added ${req.body.product} to the table!`);
            }
          }
        );
      }
    });
  });

  // GET /checkdb
  app.get('/values', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT value FROM `db`.`test_table`', function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error('Error while fetching values: \n', err);
            res.status(400).json({
              data: [],
              error: 'Error obtaining values'
            });
          } else {
            res.status(200).json({
              data: rows
            });
          }
        });
      }
    });
  });

  // POST /api/createUser
  //sign in api to create new user
  app.post('/api/createUser', async (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        //logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        let firstName = req.body['firstName'];
        let lastName = req.body['lastName'];
        let userEmail = req.body['userEmail'];
        let userPassword = req.body['userPassword'];
        let exposure = req.body['exposure'];
        let jobTitle = req.body['jobTitle'];
        let officeId = req.body['officeId'];
        let bossId = req.body['officeId'];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        let insert = [[firstName, lastName, userEmail, hash, exposure, jobTitle, officeId]];
        let sql1 = "SELECT userId FROM users WHERE userEmail ='" + userEmail + "'";

        connection.query(sql1, function (err, rows, fields) {
          if (err) {
            logger.error('Error while fetching values: \n', err);
            res.status(400).json({
              data: [],
              error: 'Error obtaining values'
            });
          } else {
            if (rows.length == 0) {
              let sql =
                'INSERT INTO users(firstName, lastName, userEmail, userPassword, exposure, jobTitle, officeId) VALUES ?';
              console.log(sql);
              // if there is no issue obtaining a connection, execute query and release connection
              connection.query(sql, [insert], function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error('Error while fetching values: \n', err);
                  res.status(400).json({
                    data: [],
                    error: 'Error obtaining values'
                  });
                } else {
                  let users = {
                    email: userEmail,
                    pxcd: hash
                  };
                  res.cookie(cookieName, users);
                  res.status(200).json({
                    data: rows
                  });
                }
              });
            } else {
              //user already exists
              res.status(400).json({
                status: 1
              });
            }
          }
        });
      }
    });
  });

  // GET /api/login
  //authentification route, returns 0 if successful login, 1 if user doesn't exist, and 2 if incorrect password
  app.get('/api/login', async (req, res) => {
    console.log(req.cookies);

    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        let userEmail = req.query['userEmail'];
        let userPassword = req.query['userPassword'];
        let sql1 = "SELECT userId FROM users WHERE userEmail ='" + userEmail + "'";
        connection.query(sql1, function (err, rows, fields) {
          if (err) {
            logger.error('Error while fetching values: \n', err);
            res.status(400).json({
              data: [],
              error: 'Error obtaining values'
            });
          } else {
            console.log(rows.length);
            //if the user exists
            if (rows.length > 0) {
              const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
              // Do not print hashes
              // console.log(hash);
              let sql2 =
                "SELECT userId FROM users WHERE userEmail ='" +
                userEmail +
                "' AND " +
                "userPassword = '" +
                hash +
                "'";
              connection.query(sql2, function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error('Error while fetching values: \n', err);
                  res.status(400).json({
                    data: [],
                    error: 'Error obtaining values'
                  });
                } else {
                  //returns 2 if the password is wrong
                  const response =
                    rows.length > 0
                      ? {
                          status: 0,
                          userId: rows[0].userId,
                          officeId: rows[0].officeId,
                          jobTitle: rows[0].jobTitle
                        }
                      : { status: 2 };
                  let users = {
                    email: userEmail,
                    pxcd: hash
                  };
                  res.status(200).json(response);
                }
              });
            }
            //if the user doesn't exist
            else {
              res.status(200).json({ status: 1 });
            }
          }
        });
      }
    });
  });

  // GET /api/user
  //get information about specific user
  app.get('/api/user', (req, res) => {
    //JSON object to be added to cookie
    // obtain a connection from our pool of connections

    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        let userId = req.query['userId'];
        let sql = 'SELECT * FROM users WHERE userId = ?';
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, userId, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error('Error while fetching values: \n', err);
            res.status(400).json({
              data: [],
              error: 'Error obtaining values'
            });
          } else {
            res.status(200).json({
              data: rows
            });
          }
        });
      }
    });
  });

  // PUT /api/changePassword
  //change user password
  app.put('/api/changePassword', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        //query values

        let userEmail = req.query['userEmail'];
        let previousPassword = req.body['previousPassword'];
        let newPassword = req.body['newPassword'];
        let sql1 = "SELECT userId FROM users WHERE userEmail ='" + userEmail + "'";

        if (cookieName in req.cookies) {
          if (
            req.cookies[cookieName]['email'] == userEmail &&
            req.cookies[cookieName]['pxcd'] == previousPassword
          ) {
          } else {
            //bad credentials
            res.status(200).json({ status: 2 });
          }
        } else {
          //if the user doesn't exist
          res.status(200).json({ status: 1 });
        }

        connection.query(sql1, function (err, rows, fields) {
          if (err) {
            logger.error('Error while fetching values: \n', err);
            res.status(400).json({
              data: [],
              error: 'Error obtaining values'
            });
          } else {
            console.log(rows.length);
            //if the user exists
            if (rows.length > 0) {
              const hash = crypto
                .createHmac('sha256', secret)
                .update(previousPassword)
                .digest('hex');

              let sql2 =
                "SELECT userId FROM users WHERE userEmail ='" +
                userEmail +
                "' AND " +
                "userPassword = '" +
                hash +
                "'";
              connection.query(sql2, function (err, rows, fields) {
                if (err) {
                  logger.error('Error while fetching values: \n', err);
                  res.status(400).json({
                    data: [],
                    error: 'Error obtaining values'
                  });
                } else {
                  if (rows.length > 0) {
                    const hash2 = crypto
                      .createHmac('sha256', secret)
                      .update(newPassword)
                      .digest('hex');

                    let sql3 =
                      "UPDATE users SET userPassword = '" +
                      hash2 +
                      "' WHERE userEmail = '" +
                      userEmail +
                      "' AND userPassword = '" +
                      hash +
                      "';";
                    connection.query(sql3, function (err, rows, fields) {
                      if (err) {
                        logger.error('Error while fetching values: \n', err);
                        res.status(400).json({
                          data: [],
                          error: 'Error obtaining values'
                        });
                      } else {
                        //changed!
                        res.status(200).json({ status: 0 });
                      }
                    });
                  } else {
                    //returns 2 if the password is wrong
                    res.status(200).json({ status: 2 });
                    res.end();
                  }
                }
              });
            }
            //if the user doesn't exist
            else {
              res.status(200).json({ status: 1 });
              res.end();
            }
          }
        });
      }
      connection.release();
    });
  });

  app.use('/api/manager', manager);
  app.use('/api/manager', manager);
  app.use('/api/employee', employee);
  app.use('/api/custodian', custodian);
  app.use('/api', office);
  app.use('/api', clocking);
  app.use('/api', reservations);
  app.use('/api', rooms);
};
