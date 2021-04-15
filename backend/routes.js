const secret = 'covidPlannerDB';
const pool = require('./db')
const crypto = require('crypto');
const { json } = require('body-parser');
const manager = require('./routes/manager');

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

  // GET /api/clockInStats
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
        let userPassword = req.body["userPassword"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //does credential check and gets the necessary information to be returned back to the user
        let sql = 'SELECT c.clockIn, c.clockOut, c.clockInType, c.clockOutType, c.roomId FROM clocking as c INNER JOIN users as u ON c.userId = u.userId WHERE u.userId=' + userId  + " AND u.userPassword = '"+hash+"' ORDER BY clockIn";
        
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

  // POST /api/requestClockChange
  //sends inbox message to employees boss
  app.post('/api/requestClockChange', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let clockId = req.query["clockId"];
        let newClockIn = req.body["newClockIn"];
        let newClockOut = req.body["newClockOut"];
        let newClockInType = req.body["newClockInType"];
        let newClockOutType = req.body["newClockOutType"];
        let sendDate = req.body["sendDate"];
        let userId;
        //checks credentials, and retrieves information about specific clock instance
        let sql = "SELECT u.reportsTo, u.userId, c.clockIn, c.clockOut, c.clockInType, c.clockOutType, c.roomId FROM users as u INNER JOIN clocking as c ON c.userId = u.userId WHERE u.userEmail='"+userEmail+"' AND c.clockId=" + clockId;
        console.log(sql)
        let reportsTo = null;
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            console.log(rows);
            if(rows.length > 0){
              reportsTo = rows[0]["reportsTo"];
              userId = rows[0]["userId"]; 
              //check if there is a reports to and creates message if employee has boss
              if(reportsTo){
                let tempObj = {};
                if(newClockIn)
                  tempObj["clockIn"] = newClockIn;
                if(newClockOut)
                  tempObj["clockOut"] = newClockOut;
                if(newClockInType)
                  tempObj["clockInType"] = newClockInType;
                if(newClockOutType)
                  tempObj["clockOutType"] = newClockOutType;
                let content = "Employee " + userId + " ("+userEmail+")" + " has requested a time change: \n";
                for(const property in tempObj)
                  content += ("\t" + property + ": " + tempObj[property] + "\n")
                console.log(content)
                //creates message and adds additional data for future functionality for the boss approving the request with a few clicks
                let message = {"content" : content, "data" : {"type": "dateChangeRequest", "changes" : tempObj }}
                let values = [[userId, reportsTo, "SCHEDULE CHANGE", sendDate, JSON.stringify(message)]]
                sql = "INSERT INTO inbox(senderId, recipientId, subject, sendDate, message) VALUES ?";
                connection.query(sql, [values], function (err, rows, fields) {
                  connection.release();
                  if (err) {
                    logger.error("Error while fetching values: \n", err);
                    res.status(400).json({
                      "data": [],
                      "error": "Error obtaining values"
                    })
                  } else { 
                    //if all is well return 0
                    res.status(200).json({
                      "status": 0
                    })
                  }
                });
              }
              else{
                //if all user has no boss return 2
                res.status(200).json({
                  "status": 2
                })
              }
              
            }
          }  
        });


        

      }
    });
    
  });

  // GET /api/clockRequests
  //returns the requests for clock in/out changes to the Office Manager
  app.get('/api/clockRequests', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userId = req.body["userId"];
        let userPassword = req.body["userPassword"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT i.messageId, i.subject, i.message, i.sendDate, i.senderId FROM inbox as i INNER JOIN users as u ON i.recipientId = u.userId WHERE u.userPassword=\'' + hash  + "' AND i.recipientId = '"+userId+"' ORDER BY i.sendDate";
        
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
            })
          }
        });
      }
    });
  });

  // GET /api/rooms
  //returns all the rooms in the database
  app.get('/api/rooms', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              sql = 'SELECT * FROM rooms';
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
                  })
                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": "1"
              })
            }
          }
        });
      }
    });
    
  });

  // GET /api/availableRegularRoom
  //returns all the available generalRooms
  app.get('/api/availableRegularRoom', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              sql = 'SELECT r.* FROM rooms as r INNER JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity - c.roomCount) > 0 AND roomType = 1';
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
                  })
                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": "1"
              })
            }
          }
        });
      }
    });
    
  });

  // GET /api/availableConferenceRoom
  //returns all the available Conference Rooms
  app.get('/api/availableConferenceRoom', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              sql = 'SELECT r.* FROM rooms as r INNER JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity - c.roomCount) > 0 AND roomType = 2';
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
                  })
                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": "1"
              })
            }
          }
        });
      }
    });
    
  });

  // GET /api/availableRegularGivenCapacity
  //returns all the available Conference rooms that is >= a certain capacity
  app.get('/api/availableRegularGivenCapacity', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let capacity = req.body["capacity"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              sql = 'SELECT r.* FROM rooms as r INNER JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity - c.roomCount) >= '+capacity+' AND roomType = 1';
              connection.query(sql, function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else { 
                  //success
                  res.status(200).json({
                    "data": rows
                  })
                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": 1
              })
            }
          }
        });
      }
    });
    
  });

    // GET /api/availableConferencesGivenCapacity
  //returns all the available Conference rooms that is >= a certain capacity
  app.get('/api/availableConferencesGivenCapacity', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let capacity = req.body["capacity"];
        let dateTime = req.body["dateTime"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
                sql = 'SELECT (r.capacity - '+
                'CASE '+ 
                    'WHEN r2.amount IS NOT NULL '+
                        'THEN r2.amount ' +
                    'ELSE 0 ' +
                'END ' +   
                ') as difference, r.roomId  FROM rooms r LEFT JOIN (SELECT COUNT(*) as amount, roomId FROM reservations WHERE dateIn <= \''+dateTime+'\' AND dateOut >= \''+ dateTime +'\' GROUP BY roomId ) r2 ON r.roomId = r2.roomId WHERE r.roomType = 2 AND (r.capacity - '+
                'CASE '+
                    'WHEN r2.amount IS NOT NULL '+
                        'THEN r2.amount '+
                    'ELSE 0 '+
                'END '+    
                ') >= '+capacity;     
                console.log(sql)     
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
                    })
                  }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": "1"
              })
            }
          }
        });
      }
    });
    
  });

  // GET /api/availableRegularGivenCapacity
  //returns all the available Conference rooms that is >= a certain capacity
  app.get('/api/availableRegularGivenCapacity', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let capacity = req.body["capacity"];
        let dateTime = req.body["dateTime"];
        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              sql = 'SELECT r.* FROM rooms as r INNER JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity - c.roomCount) >= '+capacity+' AND roomType = 1';
              connection.query(sql, function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else { 
                  //success
                  res.status(200).json({
                    "data": rows
                  })
                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": 1
              })
            }
          }
        });
      }
    });
    
  });

  // GET /api/reservation
  //delete reservation
  app.delete('/api/reservation', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let reservationId = req.query["reservationId"];
        let dateIn = req.body["dateIn"];
        let dateOut = req.body["dateOut"];
        let roomId = req.body["roomId"];

        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              //Gets the reservationId of the original meeting creator
              sql = 'SELECT MIN(reservationId) as minId FROM reservations WHERE dateIn=\''+dateIn + '\' AND dateOut=\'' + dateOut + '\' AND roomId=' + roomId + ' GROUP BY dateIn, dateOut, roomId';
              connection.query(sql, function (err, rows, fields) {
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else { 
                  //If user deleting is not the original creator of the meeting
                  if(rows[0]["minId"] == reservationId){
                    sql = 'DELETE FROM reservations WHERE dateIn=\''+dateIn + '\' AND dateOut=\'' + dateOut + '\' AND roomId=' + roomId;
                    connection.query(sql, function (err, rows, fields) {
                      if (err) {
                        logger.error("Error while fetching values: \n", err);
                        res.status(400).json({
                          "data": [],
                          "error": "Error obtaining values"
                        })
                      } else { 
                        //success
                        res.status(200).json({
                          "status": 0
                        })
      
                      }
                    });
                  }
                  else{
                    //If user deleting is not original creator of the meeting
                    sql = 'DELETE FROM reservations WHERE reservationId=' + reservationId;
                    connection.query(sql, function (err, rows, fields) {
                      if (err) {
                        logger.error("Error while fetching values: \n", err);
                        res.status(400).json({
                          "data": [],
                          "error": "Error obtaining values"
                        })
                      } else { 
                        //success
                        res.status(200).json({
                          "status": 0
                        })
      
                      }
                    });
                  }

                }
              });
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": 1
              })
            }
          }
        });
      }
    });
    
  });

  

  // POST /api/reservation 
  //add new reservation, USE ORIGINAL REQUESTS AND ACCEPTANCES WITH THIS ROUTE
  app.post('/api/reservation', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let roomId = req.query["roomId"];
        let clockIn = req.body["dateIn"];
        let clockOut = req.body["dateOut"];
        let additionalUsers = req.body["additionalUsers"] ? req.body["additionalUsers"] : [];
        let sendDate = req.body["sendDate"] ? req.body["sendDate"] : null;

        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              let userId = rows[0]["userId"];
              let values = [
                [roomId, clockIn, clockOut, userId]
              ];
              
              //Add the reservation made by the one who makes the meeting
              
              sql = 'INSERT INTO reservations(roomId, dateIn, dateOut, userId) VALUES ?';
              connection.query(sql, [values], function (err, rows, fields) {
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else { 
                  //if the original meeting creators add any addition attendee
                  if(additionalUsers.length > 0){
                    //get all the userIds of the additionalUsers
                    sql = 'SELECT userId, userEmail FROM users WHERE userEmail IN (?)';
                    let individualUserIds = {};
                    connection.query(sql, additionalUsers, function (err, rows, fields) {
                      if (err) {
                        logger.error("Error while fetching values: \n", err);
                        res.status(400).json({
                          "data": [],
                          "error": "Error obtaining values"
                        })
                      } else { 
                        //success
                        //sends the additional users an invitation in their inbox
                        for(const userInfo of rows)
                          individualUserIds[userInfo["userId"]] = userInfo["userEmail"];
                        console.log(rows)
                        let tempObj = {};
                        if(clockIn)
                          tempObj["clockIn"] = clockIn;
                        if(clockOut)
                          tempObj["clockOut"] = clockOut;
                        if(roomId)
                          tempObj["roomId"] = roomId;
                        tempObj["additionalUsers"] = null;
                        let content = "Employee " + userId + " ("+userEmail+")" + " has invited you to a meeting in room "+roomId+" from "+clockIn+" to "+clockOut+" \n";
                        console.log(content)
                        //creates message and adds additional data for future functionality for the boss approving the request with a few clicks
                        let message = {"content" : content, "data" : {"type": "meetingInvitation", "details" : tempObj }}
                        values = [];
                        for(const property in individualUserIds)
                          values.push([userId, property, "NEW INVITE", sendDate,  JSON.stringify(message)]);
                        sql = "INSERT INTO inbox(senderId, recipientId, subject, sendDate, message) VALUES ?";
                        connection.query(sql, [values], function (err, rows, fields) {
                          connection.release();
                          if (err) {
                            logger.error("Error while fetching values: \n", err);
                            res.status(400).json({
                              "data": [],
                              "error": "Error obtaining values"
                            })
                          } else { 
                            //if all is well return 0
                            res.status(200).json({
                              "status": 0
                            })
                          }
                        });
                      }
                    });
                  }
                  else{
                    //if meeting creator doesn't add additional attendees then return success
                    res.status(200).json({
                      "status": 0
                    })
                  }
                }
              });
                   
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": 1
              })
            }
          }
        });
      }
    });
    
  });

  // POST /api/reservation
  //add new reservation for invitee
  app.post('/api/acceptReservation', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
      if(err){
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection',err)
        res.status(400).send('Problem obtaining MySQL connection'); 
      } else {
        let userEmail = req.body["userEmail"];
        let userPassword = req.body["userPassword"];
        let roomId = req.query["roomId"];
        let clockIn = req.body["clockIn"];
        let clockOut = req.body["clockOut"];

        const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
        //credential check and returns back all requests with the necessary information needed to approve or deny the request
        let sql = 'SELECT userId FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
        
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            logger.error("Error while fetching values: \n", err);
            res.status(400).json({
              "data": [],
              "error": "Error obtaining values"
            })
          } else { 
            if(rows.length > 0){
              let userId = row[0]["userId"];
              let values = [
                [roomId, clockIn, clockOut, userId]
              ];
              //add reservation 
              sql = 'INSERT INTO reservations(roomId, clockIn, clockOut, userId) VALUES ?';
              connection.query(sql, [values], function (err, rows, fields) {
                if (err) {
                  logger.error("Error while fetching values: \n", err);
                  res.status(400).json({
                    "data": [],
                    "error": "Error obtaining values"
                  })
                } else { 
                  //success
                  res.status(200).json({
                    "status": 0
                  })
                }
              });
              
            }
            else{
              //not logged in or incorrect credentials
              res.status(200).json({
                "status": 1
              })
            }
          }
        });
      }
    });
    
  });

  

  app.use('/api/manager',manager);
}