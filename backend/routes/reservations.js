const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');
const secret = 'covidPlannerDB';
const crypto = require('crypto');
const { off } = require('../db');


// GET /api/reservations
//returns all the reservations pertaining to a certain office
router.get('/reservations', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection) {
      if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
        logger.error('Problem obtaining MySQL connection', err);
        res.status(400).send('Problem obtaining MySQL connection');
      } else {
        let userEmail = req.body['userEmail'];
        let userPassword = req.body['userPassword'];
        let officeId = req.body["officeId"];
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
              sql = `SELECT * FROM reservations WHERE officeId = ${officeId}`;
              console.log(sql);
              connection.query(sql, function (err, rows, fields) {
                connection.release();
                if (err) {
                  logger.error('Error while fetching values: \n', err);
                  res.status(400).json({
                    data: [],
                    error: 'Error obtaining values'
                  });
                } else {
                    //returns all reservation info about an office
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

// POST /api/reservation
//add new reservation, USE ORIGINAL REQUESTS AND ACCEPTANCES WITH THIS ROUTE
router.post('/reservation', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
        let userEmail = req.body['userEmail'];
        let userPassword = req.body['userPassword'];
        let roomCode = req.body['roomCode'];
        if (!roomCode)
            //No roomId
            res.status(200).json({
            status: 4
            });
        let clockIn = req.body['dateIn'];
        let clockOut = req.body['dateOut'];
        let additionalUsers = req.body['additionalUsers'] ? req.body['additionalUsers'] : [];
        let sendDate = req.body['sendDate'] ? req.body['sendDate'] : null;
        let officeId = req.body["officeId"];
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
                    let userId = rows[0]['userId'];
                    sql = `SELECT roomId from rooms WHERE roomCode = ${roomCode} AND officeId = ${officeId}`;
                    connection.query(sql, function (err, rows, fields) {
                        if (err) {
                            logger.error('Error while fetching values: \n', err);
                            res.status(400).json({
                                data: [],
                                error: 'Error obtaining values'
                            });
                        } else {
                            if(rows.length > 0){
                                let roomId = rows[0]["roomId"];
                                let values = [[roomId, clockIn, clockOut, userId, officeId]];
                                console.log(rows);
                                //Add the reservation made by the one who makes the meeting
                                sql = 'SELECT cleaned, beingCleaned, roomType FROM rooms WHERE roomId = ' + roomId;
                                connection.query(sql, function (err, rows, fields) {
                                    if (err) {
                                        logger.error('Error while fetching values: \n', err);
                                        res.status(400).json({
                                            data: [],
                                            error: 'Error obtaining values'
                                        });
                                    } else {
                                        if (rows[0]['cleaned'] && !rows[0]['beingCleaned'] && rows[0]['roomType'] == 2) {
                                            sql = 'INSERT INTO reservations(roomId, dateIn, dateOut, userId, officeId) VALUES ?';
                                            connection.query(sql, [values], function (err, rows, fields) {
                                                if (err) {
                                                logger.error('Error while fetching values: \n', err);
                                                res.status(400).json({
                                                    data: [],
                                                    error: 'Error obtaining values'
                                                });
                                                } else {
                                                //if the original meeting creators add any addition attendee
                                                if (additionalUsers.length > 0) {
                                                    //get all the userIds of the additionalUsers
                                                    sql = 'SELECT userId, userEmail FROM users WHERE userEmail IN (?)';
                                                    let individualUserIds = {};
                                                    console.log("ADDITONAL USERS : ")
                                                    console.log(additionalUsers)
                                                    connection.query(sql, [additionalUsers], function (err, rows, fields) {
                                                        if (err) {
                                                            logger.error('Error while fetching values: \n', err);
                                                            res.status(400).json({
                                                                data: [],
                                                                error: 'Error obtaining values'
                                                            });
                                                        } else {
                                                            //success
                                                            //sends the additional users an invitation in their inbox
                                                            for (const userInfo of rows)
                                                                individualUserIds[userInfo['userId']] = userInfo['userEmail'];
                                                            console.log(rows);
                                                            let tempObj = {};
                                                            if (clockIn) tempObj['clockIn'] = clockIn;
                                                            if (clockOut) tempObj['clockOut'] = clockOut;
                                                            if (roomId) tempObj['roomId'] = roomId;
                                                            if(officeId) tempObj['officeId'] = officeId;
                                                            tempObj['additionalUsers'] = null;
                                                            let content =
                                                                `Employee ${userId} (${userEmail}) has invited you to a meeting in room ${roomCode} from ${clockIn} to ${clockOut} \n`;
                                                            console.log(content);
                                                            //creates message and adds additional data for future functionality for the boss approving the request with a few clicks
                                                            let message = {
                                                                content: content,
                                                                data: { type: 'meetingInvitation', details: tempObj }
                                                            };
                                                            console.log(individualUserIds)
                                                            values = [];
                                                            for (const property in individualUserIds)
                                                                values.push([
                                                                    userId,
                                                                    property,
                                                                    'NEW INVITE',
                                                                    sendDate,
                                                                    JSON.stringify(message)
                                                                ]);
                                                            console.log('VALUES LENGTH : ', values.length);
                                                            sql =
                                                                'INSERT INTO inbox(senderId, recipientId, subject, sendDate, message) VALUES ?';
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
                                                        }
                                                    });
                                                } else {
                                                    //if meeting creator doesn't add additional attendees then return success
                                                    res.status(200).json({
                                                    status: 0
                                                    });
                                                }
                                                }
                                            });
                                        } else if (rows[0]['roomType'] != 2) {
                                            //if the room is not a conference room
                                            res.status(200).json({
                                                status: 2
                                            });
                                        } else {
                                            //if the room is either not clean or is currently being cleaned
                                            res.status(200).json({
                                                status: 3
                                            });
                                        }
                                    }
                                });
                            }
                            else{
                                //room does not exist in office
                                res.status(200).json({
                                    status: 5
                                });
                            }
                        }
                    });
                }
                else {
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

// POST /api/reservation
//add new reservation for invitee
router.post('/acceptReservation', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.body['userEmail'];
      let userPassword = req.body['userPassword'];
      let roomId = req.body['roomId'];
      let dateIn = req.body['dateIn'];
      let dateOut = req.body['dateOut'];
      let officeId = req.body["officeId"];
      //NEW, so the inbox can be deleted after the reservation accepted
      let messageId = req.body["messageId"];
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
            let userId = rows[0]['userId'];
            let values = [[roomId, dateIn, dateOut, userId, officeId]];
            //add reservation
            sql = 'INSERT INTO reservations(roomId, dateIn, dateOut, userId, officeId) VALUES ?';
            connection.query(sql, [values], function (err, rows, fields) {
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                    sql = `DELETE FROM inbox WHERE messageId = ${messageId}`
                    connection.query(sql, [values], function (err, rows, fields) {
                        if (err) {
                            logger.error('Error while fetching values: \n', err);
                            res.status(400).json({
                                data: [],
                                error: 'Error obtaining values in DELETION'
                            });
                        } else {
                            //success
                            res.status(200).json({
                                status: 0
                            });
                        }
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

// DELETE /api/reservation
//delete reservation
router.delete('/reservation', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.body['userEmail'];
      let userPassword = req.body['userPassword'];
      let dateIn = req.body['dateIn'];
      let dateOut = req.body['dateOut'];
      let roomId = req.body['roomId'];
      let officeId = req.body['officeId'];

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
            let userId = rows[0]['userId'];
            //Gets the reservationId of the original meeting creator
            sql =
              "SELECT MIN(reservationId) as minId FROM reservations WHERE dateIn='" +
              dateIn +
              "' AND dateOut='" +
              dateOut +
              "' AND roomId=" +
              roomId +
              ' GROUP BY dateIn, dateOut, roomId';
            connection.query(sql, function (err, rows, fields) {
              if (err) {
                logger.error('Error while fetching values: \n', err);
                res.status(400).json({
                  data: [],
                  error: 'Error obtaining values'
                });
              } else {
                //If user deleting is not the original creator of the meeting
                if (rows[0]['minId'] == reservationId) {
                  sql =
                    `DELETE FROM reservations WHERE dateIn='${dateIn}' AND dateOut='${dateOut}' AND roomId=${roomId} AND officeId = ${officeId}`;
                  connection.query(sql, function (err, rows, fields) {
                    if (err) {
                      logger.error('Error while fetching values: \n', err);
                      res.status(400).json({
                        data: [],
                        error: 'Error obtaining values'
                      });
                    } else {
                      //success
                      res.status(200).json({
                        status: 0
                      });
                    }
                  });
                } else {
                  //If user deleting is not original creator of the meeting
                  sql = `DELETE FROM reservations WHERE officeId= ${officeId} AND userId = ${userId} AND dateIn = '${dateIn}' AND dateOut = '${dateOut}'`;
                  connection.query(sql, function (err, rows, fields) {
                    if (err) {
                      logger.error('Error while fetching values: \n', err);
                      res.status(400).json({
                        data: [],
                        error: 'Error obtaining values'
                      });
                    } else {
                      //success
                      res.status(200).json({
                        status: 0
                      });
                    }
                  });
                }
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

// GET /api/availableConferenceRoom
//returns all the available Conference Rooms
router.get('/availableConferenceRooms', (req, res) => {
  // obtain a connection from our pool of connections
  pool.getConnection(async function (err, connection) {
    if (err) {
      // if there is an issue obtaining a connection, release the connection instance and log the error
      logger.error('Problem obtaining MySQL connection', err);
      res.status(400).send('Problem obtaining MySQL connection');
    } else {
      let userEmail = req.query['userEmail'];
      let userPassword = req.query['userPassword'];
      let officeId = req.body['officeId'];
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
            sql = `SELECT r.* FROM rooms as r LEFT JOIN (SELECT roomId, count(*) as roomCount FROM clocking WHERE clockin IS NOT NULL AND clockOut IS NULL GROUP BY roomId) as c ON r.roomId = c.roomId WHERE (r.capacity -  (CASE WHEN c.roomCount IS NOT NULL THEN c.roomCount ELSE 0 END)) >= 0 AND roomType = 2 AND officeId = ${officeId}`;
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

// GET /api/availableConferencesGivenCapacity
//returns all the available Conference rooms that is >= a certain capacity
router.get('/availableConferencesGivenCapacity', (req, res) => {
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
      let dateTime = req.query['dateTime'];
      let officeId = req.body['officeId'];
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
            sql = `SELECT (r.capacity - 
                        CASE 
                            WHEN r2.amount IS NOT NULL 
                                THEN r2.amount 
                            ELSE 0 
                        END  
                        ) as difference, r.* FROM rooms r LEFT JOIN (SELECT COUNT(*) as amount, roomId FROM reservations WHERE dateIn <= '${dateTime}' AND dateOut >= '${dateTime}' GROUP BY roomId ) r2 ON r.roomId = r2.roomId WHERE officeId = ${officeId} AND r.roomType = 2 AND (r.capacity - 
                        CASE 
                            WHEN r2.amount IS NOT NULL 
                                THEN r2.amount 
                            ELSE 0 
                        END  
                        ) >= ${capacity}`;
            console.log(sql);
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
