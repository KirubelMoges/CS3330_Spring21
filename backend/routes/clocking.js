const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');
const crypto = require('crypto');
const secret = 'covidPlannerDB';

// GET /api/clockData
//returns all the clockIn/clockOut data
router.get('/clockData', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.query['userEmail'];
      let userPassword = req.query['userPassword'];
      let capacity = req.query['capacity'];
      const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
      //credential check and returns back all requests with the necessary information needed to approve or deny the request
      let sql =
        "SELECT userId FROM users WHERE userEmail = '" +
        userEmail +
        "' AND userPassword='" +
        hash +
        "'";

      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          if (rows.length > 0) {
            sql = 'SELECT * FROM clocking WHERE userId = ' + rows[0]['userId'];
            connection.query(sql, function (err, rows, fields) {
              connection.release();
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                //success
                res.status(200).json({
                  data: rows
                });
              }
            });
          } else {
            //not logged in or incorrect credentials
            res.status(200).json({
              status: 1
            });
          }
        }
      });
    }
  });
});

// post /api/clockin
// clock-in feature returns 0 when clock in is successful, returns 1 when user has not clockout of previous shift
router.post('/clockin', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let sql2 = 'INSERT INTO clocking(clockIn, clockInType, userId, roomId) VALUES ?';
      let clockIn = req.body['clockIn'];
      let clockInType = req.body['clockInType'];
      let userId = req.body['userId'];
      let roomId = req.body['roomId'];
      let values = [[clockIn, clockInType, userId, roomId]];
      console.log(values);
      let sql =
        'SELECT clockOut FROM clocking WHERE clockOut IS NULL AND userId=' +
        userId +
        ' ORDER BY clockIn';

      let crypto;
      try {
        crypto = await import('crypto');
      } catch (err) {
        console.log('crypto support is disabled!');
      }

      // if there is no issue obtaining a connection, execute query and release connection
      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          if (rows.length == 0) {
            connection.query(sql2, [values], function (err, rows, fields) {
              connection.release();
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                res.status(200).json({
                  status: 0
                });
              }
            });
          } else {
            res.status(200).json({
              status: 1
            });
          }
        }
      });
    }
  });
});

// put /api/clockout
//update clock-out feature returns 0 when clock out is successful, returns 1 when user has not clockin of current shift
router.put('/clockout', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let clockOut = req.body['clockOut'];
      let clockOutType = req.body['clockOutType'];
      let userId = req.body['userId'];
      let roomId = req.body['roomId'];

      let sql =
        'SELECT clockId FROM clocking WHERE clockOut IS NULL AND userId=' +
        userId +
        ' ORDER BY clockIn';

      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          if (rows.length > 0) {
            let sql2 =
              "UPDATE clocking SET clockOut='" +
              clockOut +
              "', clockOutType='" +
              clockOutType +
              "' WHERE clockId=" +
              rows[0]['clockId'];

            connection.query(sql2, function (err, rows, fields) {
              // if there is no issue obtaining a connection, execute query and release connection
              connection.release();
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                res.status(200).json({
                  status: 0
                });
              }
            });
          } else {
            res.status(200).json({
              status: 1
            });
          }
        }
      });
    }
  });
});

// POST /api/requestClockChange
//sends inbox message to employees boss
router.post('/requestClockChange', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.body['userEmail'];
      let clockId = req.query['clockId'];
      let newClockIn = req.body['newClockIn'];
      let newClockOut = req.body['newClockOut'];
      let newClockInType = req.body['newClockInType'];
      let newClockOutType = req.body['newClockOutType'];
      let sendDate = req.body['sendDate'];
      let userId;
      //checks credentials, and retrieves information about specific clock instance
      let sql =
        "SELECT u.reportsTo, u.userId, c.clockIn, c.clockOut, c.clockInType, c.clockOutType, c.roomId FROM users as u INNER JOIN clocking as c ON c.userId = u.userId WHERE u.userEmail='" +
        userEmail +
        "' AND c.clockId=" +
        clockId;
      console.log(sql);
      let reportsTo = null;
      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          console.log(rows);
          if (rows.length > 0) {
            reportsTo = rows[0]['reportsTo'];
            userId = rows[0]['userId'];
            //check if there is a reports to and creates message if employee has boss
            if (reportsTo) {
              let tempObj = {};
              if (newClockIn) tempObj['clockIn'] = newClockIn;
              if (newClockOut) tempObj['clockOut'] = newClockOut;
              if (newClockInType) tempObj['clockInType'] = newClockInType;
              if (newClockOutType) tempObj['clockOutType'] = newClockOutType;
              let content =
                'Employee ' + userId + ' (' + userEmail + ')' + ' has requested a time change: \n';
              for (const property in tempObj)
                content += '\t' + property + ': ' + tempObj[property] + '\n';
              console.log(content);
              //creates message and adds additional data for future functionality for the boss approving the request with a few clicks
              let message = {
                content: content,
                data: { type: 'dateChangeRequest', changes: tempObj }
              };
              let values = [
                [userId, reportsTo, 'SCHEDULE CHANGE', sendDate, JSON.stringify(message)]
              ];
              sql = 'INSERT INTO inbox(senderId, recipientId, subject, sendDate, message) VALUES ?';
              connection.query(sql, [values], function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error('Error while fetching values: \n', err);
                  res.status(400).json({
                    data: [],
                    error: 'Error obtaining values'
                  });
                } else {
                  //if all is well return 0
                  res.status(200).json({
                    status: 0
                  });
                }
              });
            } else {
              //if all user has no boss return 2
              res.status(200).json({
                status: 2
              });
            }
          }
        }
      });
    }
  });
});

// GET /api/clockRequests
//returns the requests for clock in/out changes to the Office Manager
router.get('/clockRequests', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userId = req.body['userId'];
      let userPassword = req.body['userPassword'];
      const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
      //credential check and returns back all requests with the necessary information needed to approve or deny the request
      let sql =
        "SELECT i.messageId, i.subject, i.message, i.sendDate, i.senderId FROM inbox as i INNER JOIN users as u ON i.recipientId = u.userId WHERE u.userPassword='" +
        hash +
        "' AND i.recipientId = '" +
        userId +
        "' ORDER BY i.sendDate";

      connection.query(sql, function (err, rows, fields) {
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

// GET /api/availableRegularGivenCapacity
//returns all the available Conference rooms that is >= a certain capacity
router.get('/availableRegularGivenCapacity', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.body['userEmail'];
      let userPassword = req.body['userPassword'];
      let capacity = req.body['capacity'];
      const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
      //credential check and returns back all requests with the necessary information needed to approve or deny the request
      let sql =
        "SELECT userId FROM users WHERE userEmail = '" +
        userEmail +
        "' AND userPassword='" +
        hash +
        "'";

      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          if (rows.length > 0) {
            sql = `SELECT r.* FROM rooms as r LEFT JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity -  (CASE WHEN c.roomCount IS NOT NULL THEN c.roomCount ELSE 0 END)) >= ${capacity} AND roomType < 2`;
            connection.query(sql, function (err, rows, fields) {
              connection.release();
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                //success
                res.status(200).json({
                  data: rows
                });
              }
            });
          } else {
            //not logged in or incorrect credentials
            res.status(200).json({
              status: 1
            });
          }
        }
      });
    }
  });
});
// GET /api/availableRegularRoom
//returns all the available generalRooms
router.get('/availableRegularRoom', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.body['userEmail'];
      let userPassword = req.body['userPassword'];
      const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
      //credential check and returns back all requests with the necessary information needed to approve or deny the request
      let sql =
        "SELECT userId FROM users WHERE userEmail = '" +
        userEmail +
        "' AND userPassword='" +
        hash +
        "'";

      connection.query(sql, function (err, rows, fields) {
        if (err) {
          logger.error('Error while fetching values: \n', err);
          res.status(400).json({
            data: [],
            error: 'Error obtaining values'
          });
        } else {
          if (rows.length > 0) {
            sql = `SELECT r.* FROM rooms as r LEFT JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity -  (CASE WHEN c.roomCount IS NOT NULL THEN c.roomCount ELSE 0 END)) > 0 AND roomType < 2`;
            connection.query(sql, function (err, rows, fields) {
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
          } else {
            //not logged in or incorrect credentials
            res.status(200).json({
              status: '1'
            });
          }
        }
      });
    }
  });
});

module.exports = router;
