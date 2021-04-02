const secret = 'covidPlannerDB';
const pool = require('./db')
const crypto = require('crypto');
const { json } = require('body-parser');

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

  // POST /reset
  app.post('/reset', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if (err){
        console.log(connection);
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query
        connection.query('drop table if exists test_table', function (err, rows, fields) {
          if (err) { 
            // if there is an error with the query, release the connection instance and log the error
            connection.release()
            logger.error("Problem dropping the table test_table: ", err); 
            res.status(400).send('Problem dropping the table'); 
          } else {
            // if there is no error with the query, execute the next query and do not release the connection yet
            connection.query('CREATE TABLE `db`.`test_table` (`id` INT NOT NULL AUTO_INCREMENT, `value` VARCHAR(45), PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);', function (err, rows, fields) {
              if (err) { 
                // if there is an error with the query, release the connection instance and log the error
                connection.release()
                logger.error("Problem creating the table test_table: ", err);
                res.status(400).send('Problem creating the table'); 
              } else { 
                // if there is no error with the query, release the connection instance
                connection.release()
                res.status(200).send('created the table'); 
              }
            });
          }
        });
      }
    });
  });

  // POST /multplynumber
  app.post('/multplynumber', (req, res) => {
    console.log(req.body.product);
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('INSERT INTO `db`.`test_table` (`value`) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
          connection.release();
          if (err) {
            // if there is an error with the query, log the error
            logger.error("Problem inserting into test table: \n", err);
            res.status(400).send('Problem inserting into table'); 
          } else {
            res.status(200).send(`added ${req.body.product} to the table!`);
          }
        });
      }
    });
  });

  // GET /checkdb
  app.get('/values', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query('SELECT value FROM `db`.`test_table`', function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
    
  });

  // POST /api/createUser
  //sign in api to create new user
  app.post('/api/createUser', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let firstName = req.body["firstName"];
        let lastName = req.body["lastName"];
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let exposure = req.body["exposure"];
        let jobTitle = req.body["jobTitle"];
        let officeId = req.body["officeId"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        let insert = [
          [firstName, lastName, userEmail, hash, exposure, jobTitle, officeId, ]
        ];
        let sql = 'INSERT INTO users(firstName, lastName, userEmail, userPassword, exposure, jobTitle, officeId) VALUES ?';
        console.log(sql);
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, [insert], function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
    
  });

  // GET /api/login
  //authentification route, returns 0 if successful login, 1 if user doesn't exist, and 2 if incorrect password
  app.get('/api/login', async(req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.query["userEmail"];
        let userPassword = req.body["userPassword"];
        let sql1 = 'SELECT userId FROM users WHERE userEmail =\'' + userEmail + '\'';
        connection.query(sql1, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            console.log(rows.length)
            //if the user exists
            if(rows.length > 0){
              const hash = crypto.createHmac('sha256', secret)
                            .update(userPassword)
                            .digest('hex');
              console.log(hash)
              let sql2 = 'SELECT userId FROM users WHERE userEmail =\'' + userEmail + '\' AND ' + 'userPassword = \'' + hash + '\'';
              connection.query(sql2, function (err, rows, fields) {
                connection.release();

                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else {
                  //returns 2 if the password is wrong
                  res.status(200).json({"status" : rows.length > 0 ? 0 : 2});
                }
              });
            }
            //if the user doesn't exist
            else{
              res.status(200).json({"status" : 1});
            }
          }
        });     
      }

    });
    
  });

  // GET /api/user
  //get information about specific user
  app.get('/api/user', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userId = req.query["userId"];
        let sql = 'SELECT * FROM users WHERE userId = ?';
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, userId, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
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
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {

        //query values

        let userEmail = req.query["userEmail"];
        let previousPassword = req.body["previousPassword"];
        let newPassword = req.body["newPassword"];
        let sql1 = 'SELECT userId FROM users WHERE userEmail =\'' + userEmail + '\'';

        connection.query(sql1, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            console.log(rows.length)
            //if the user exists
            if(rows.length > 0){
              const hash = crypto.createHmac('sha256', secret).update(previousPassword).digest('hex');

              let sql2 = 'SELECT userId FROM users WHERE userEmail =\'' + userEmail + '\' AND ' + 'userPassword = \'' + hash + '\'';
              connection.query(sql2, function (err, rows, fields) {
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else {
                  if(rows.length > 0){
                    const hash2 = crypto.createHmac('sha256', secret).update(newPassword).digest('hex');

                    let sql3 = "UPDATE users SET userPassword = '"+ hash2 +"' WHERE userEmail = '"+ userEmail +"' AND userPassword = '" + hash + "';";
                    connection.query(sql3, function (err, rows, fields) {
                      if (err) {
                        logger.error("Error while fetching values: \n", err);
                        res.status(400).json({
                          "data": [],
                          "error": "Error obtaining values"
                        })
                      } else {
                        //changed!
                        res.status(200).json({"status" : 0});
                      }
                    });
                  }
                  else{
                    //returns 2 if the password is wrong
                    res.status(200).json({"status" : 2});
                    res.end();
                  }
                }
              });
            }
            //if the user doesn't exist
            else{
              res.status(200).json({"status" : 1});
              res.end();
            }
          }
        }); 
      }
      connection.release();

    });
  });



  // POST /api/createOffice
  //creates new Office
  app.post('/api/createOffice', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let city = req.body["city"];
        let state = req.body["state"];
        let countryCode = req.body["countryCode"];
        let insert = [
          [city, state, countryCode]
        ];
        let sql = 'INSERT INTO offices(city, state, countryCode) VALUES ?';
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, [insert], function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
    
  });

  // GET /api/office
  //get specific information about an office
  app.get('/api/office', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let officeid = req.query["officeId"];
        let sql = 'SELECT * FROM offices WHERE officeId = ?';
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, officeid, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
  });
    // get /api/offices
    // get all office information
  app.get('/api/offices', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let sql = 'SELECT * FROM offices';
        let crypto;
        try {
          crypto = await import('crypto');
        } catch (err) {
          console.log('crypto support is disabled!');
        }
        
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, function (err, rows, fields) {
          connection.release();
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            res.status(200).json({
              "data": rows
            });
          }
        });
      }
    });
    
  });

  // post /api/clockin
  // clock-in feature returns 0 when clock in is successful, returns 1 when user has not clockout of previous shift
  app.post('/api/clockin', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let sql2 = 'INSERT INTO clocking(clockIn, clockInType, userId, roomId) VALUES ?';
        let clockIn = req.body["clockIn"];
        let clockInType = req.body["clockInType"];
        let userId = req.body["userId"];
        let roomId = req.body["roomId"];
        let values = [
          [clockIn, clockInType, userId, roomId]
        ];
        let sql = 'SELECT clockOut FROM clocking WHERE clockOut IS NULL AND userId=' + userId  + " ORDER BY clockIn";

        let crypto;
        try {
          crypto = await import('crypto');
        } catch (err) {
          console.log('crypto support is disabled!');
        }
        
        // if there is no issue obtaining a connection, execute query and release connection
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            if(rows.length == 0){
              connection.query(sql2, [values], function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else {
                  res.status(200).json({
                    "status": 0
                  });
                }
              });
            }
            else{
              res.status(200).json({
                "status": 1
              });
            }

          }
        });
      }
    });
    
  });

  // put /api/clockout
  //update clock-out feature returns 0 when clock out is successful, returns 1 when user has not clockin of current shift
  app.put('/api/clockout', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let clockOut = req.body["clockOut"];
        let clockOutType = req.body["clockOutType"];
        let userId = req.body["userId"];
        let roomId = req.body["roomId"];

        let sql = 'SELECT clockId FROM clocking WHERE clockOut IS NULL AND userId=' + userId  + " ORDER BY clockIn";
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else {
            if(rows.length > 0 ){
              
              let sql2 = "UPDATE clocking SET clockOut='" + clockOut + "', clockOutType='"+clockOutType+"' WHERE clockId=" + rows[0]["clockId"];

              connection.query(sql2, function (err, rows, fields) {
                // if there is no issue obtaining a connection, execute query and release connection
                connection.release();
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else {
                  res.status(200).json({
                    "status": 0
                  });
                }
              });
            }
            else{
              res.status(200).json({
                "status": 1
              });
            }

          }
        });
      }
    });
    
  });

  // GET /api/clockout
  //returns data about user's clockIn and clockOut records
  app.get('/api/clockInStats', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userId = req.query["userId"];

        let sql = 'SELECT * FROM clocking WHERE userId=' + userId  + " ORDER BY clockIn";
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            res.status(200).json({
              "data": rows
            })
          }
        });
      }
    });
    
  });
}