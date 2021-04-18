const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

router.post('/room', async (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
            var name = req.query.name;
            let capacity = req.query['capacity'] || 50;
            let lastCleaned = req.query['lastCleaned'] || null;
            let availability = req.query['availability'] || 1;
            let cleaned = req.query['cleaned'] || 1;

            console.log(`Name: ${name}`)

            // if there is no issue obtaining a connection, execute query
            connection.query('INSERT INTO rooms (capacity,lastCleaned,availability,cleaned,name) value(?,?,?,?,?)',[capacity,lastCleaned,availability,cleaned,name], (err, rows, fields) => {
              if (err) {
                logger.error("Error while adding room \n", err);
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
          connection.release();
    });
  });

  router.get('/room', async (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
            // if there is no issue obtaining a connection, execute query
            connection.query('SELECT * FROM rooms',(err, rows, fields) => {
              if (err) {
                logger.error("Error while adding room \n", err);
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
          connection.release();
    });
  });

router.delete('/room', async (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          let name = req.query['name'];
          let roomId = req.query['roomId'];
          // if there is no issue obtaining a connection, execute query

          if(name)
          {
            connection.query('DELETE FROM rooms WHERE name = (?)',name, (err, rows, fields) => {
              connection.release();
  
              if (err) {
                logger.error("Error while deleting room \n", err);
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
          else if(roomId)
          {
            connection.query('DELETE FROM rooms WHERE roomId = (?)',roomId, (err, rows, fields) => {
              connection.release();
  
              if (err) {
                logger.error("Error while deleting room \n", err);
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
          
        };
        connection.release();
  });
});

//EPIC 6.2
router.get('/allUnreservedRooms', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          connection.query('SELECT * FROM rooms WHERE roomId NOT IN (SELECT DISTINCT roomId FROM reservations)', (err, rows, fields) => {
            if (err) {
              logger.error("Error while deleting room \n", err);
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
        connection.release();
  });
});

router.get('/allReservedRooms', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          connection.query('SELECT * FROM rooms WHERE roomId IN (SELECT DISTINCT roomId FROM reservations)', (err, rows, fields) => {
            if (err) {
              logger.error("Error while deleting room \n", err);
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
        connection.release();
  });
});

router.get('/specificRoomReservation', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let roomId = req.query['roomId'];
          connection.query('SELECT * FROM reservations WHERE roomId = (?)',roomId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while deleting room \n", err);
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
        connection.release();
  });
});

router.put('/setRoomToUncleaned', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          let roomId = req.query["roomId"];
          let name = req.query["name"];
          // if there is no issue obtaining a connection, execute query

          if(roomId)
          {
            connection.query('UPDATE rooms SET cleaned = 0 WHERE roomId = (?)',roomId, (err, rows, fields) => {
              if (err) {
                logger.error("Error while deleting room \n", err);
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
          else if(name)
          {
            connection.query('UPDATE rooms SET cleaned = 0 WHERE name = (?)',name, (err, rows, fields) => {
              if (err) {
                logger.error("Error while deleting room \n", err);
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
        }
        connection.release();
  });
});

router.put('/setRoomToCleaned', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          let roomId = req.query["roomId"];
          let name = req.query["name"];
          let lastCleaned = req.query['lastCleaned']
          // if there is no issue obtaining a connection, execute query

          if(roomId)
          {
            connection.query('UPDATE rooms SET cleaned = 1 , lastCleaned = (?) WHERE roomId = (?)',[lastCleaned,roomId], (err, rows, fields) => {
              if (err) {
                logger.error("Error while deleting room \n", err);
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
          else if(name)
          {
            connection.query('UPDATE rooms SET cleaned = 1 , lastCleaned = (?) WHERE name = (?)',[lastCleaned,name], (err, rows, fields) => {
              if (err) {
                logger.error("Error while deleting room \n", err);
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
        }
        connection.release();
  });
});

router.post('/addReservation', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let roomId = req.query['roomId'];
          let dateIn = req.query['dateIn'];
          let dateOut = req.query['dateOut'];
          let userId = req.query['userId'];

          connection.query('INSERT INTO reservations (roomId,dateIn,dateOut,userId) values(?,?,?,?)',[roomId,dateIn,dateOut,userId], (err, rows, fields) => {
            if (err) {
              logger.error("Error while inserting reservations room \n", err);
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
        connection.release();
  });
});

router.delete('/deleteReservation', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let reservationId = req.query['reservationId'];

          connection.query('DELETE FROM reservations WHERE reservationId = (?)',reservationId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while inserting reservations room \n", err);
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
        connection.release();
  });
});

router.put('/editReservation', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let dateIn = req.query['dateIn'];
          let dateOut = req.query['dateOut'];
          let reservationId = req.query['reservationId'];
          let userId = req.query['userId'];

          connection.query('UPDATE reservations SET dateIn = (?), dateOut = (?), userId = (?) WHERE reservationId = (?)',[dateIn,dateOut,userId,reservationId], (err, rows, fields) => {
            if (err) {
              logger.error("Error while inserting reservations room \n", err);
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
        connection.release();
  });
});

router.get('/getAllReservationsBetweenTimeFrame', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let dateIn = req.query['dateIn'];
          let dateOut = req.query['dateOut'];

          connection.query('SELECT * from reservations WHERE dateIn >= (?) AND dateOut <= (?)',[dateIn,dateOut], (err, rows, fields) => {
            if (err) {
              logger.error("Error while getting reservations room \n", err);
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
        connection.release();
  });
});

router.get('/getAllReservationsByUserId', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let userId = req.query['userId'];
          connection.query('SELECT * from reservations WHERE userId = (?)',userId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while getting reservations room \n", err);
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
        connection.release();
  });
});

router.get('/getReservationByReservationId', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let reservationId = req.query['reservationId'];
          connection.query('SELECT * from reservations WHERE reservationId = (?)',reservationId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while getting reservations room \n", err);
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
        connection.release();
  });
});

router.get('/getAllReservationsByRoomId', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let roomId = req.query['roomId'];
          connection.query('SELECT * from reservations WHERE roomId = (?)',roomId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while getting reservations room \n", err);
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
        connection.release();
  });
});

router.post('/covidContact', async (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let userIdA = req.query['userIdA'];
          let userIdB = req.query['userIdB'];
          let comment = req.query['comment'];
          connection.query('INSERT INTO covidContacts (userIdA,userIdB,comment) values(?,?,?)',[userIdA,userIdB,comment], (err, rows, fields) => {
            if (err) {
              logger.error("Error while adding covid contacts \n", err);
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
        connection.release();
  });
});

router.delete('/covidContact', async (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let contactId = req.query['contactId'];
          connection.query('DELETE FROM covidContacts WHERE contactId = (?)',contactId, (err, rows, fields) => {
            if (err) {
              logger.error("Error while adding covid contacts \n", err);
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
        connection.release();
  });
});

router.get('/getAllPeopleInContactWithUserId', (req,res) => {
  pool.getConnection((err,connection) => {
      if (err){
          console.log(connection);
          // if there is an issue obtaining a connection, release the connection instance and log the error
          logger.error('Problem obtaining MySQL connection', err)
          res.status(400).send('Problem obtaining MySQL connection'); 
        } else
        {
          // if there is no issue obtaining a connection, execute query
          let userId = req.query['userId'];
          connection.query('SELECT * FROM users WHERE userId IN (SELECT DISTINCT userIdB FROM covidContacts WHERE userIdA = (?))',userId,(err, rows, fields) => {
            if (err) {
              logger.error("Error while getting covid contacts \n", err);
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
        connection.release();
  });
});

module.exports = router;