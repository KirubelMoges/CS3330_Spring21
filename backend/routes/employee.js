const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');

//EPIC 2.1 / 2.2
router.get('/getSchedulesDuringMonthAndYear', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let month = req.body['month'];
              let year = req.body['year'];
            // if there is no issue obtaining a connection, execute query
            connection.query('SELECT * FROM schedules WHERE MONTH(dateIn) = (?) AND YEAR(dateIn) = (?)',[month,year], (err, rows, fields) => {
              if (err) {
                logger.error("Error while fetching schedules\n", err);
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

//EPIC 2.3

router.get('/getReservationsDuringMonthAndYear', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let month = req.body['month'];
              let year = req.body['year'];
            // if there is no issue obtaining a connection, execute query
            connection.query('SELECT * FROM schedules WHERE MONTH(dateIn) = (?) AND YEAR(dateIn) = (?)',[month,year], (err, rows, fields) => {
              if (err) {
                logger.error("Error while fetching schedules\n", err);
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

//EPIC 2.4
  router.post('/createEvent', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let roomId = req.body['roomId'];
              let dateIn = req.body['dateIn'];
              let dateOut = req.body['dateOut'];
              let userId = req.body['userId'];
              let creatorType = req.body['creatorType'];
            // if there is no issue obtaining a connection, execute query
            connection.query('INSERT INTO reservations (roomId, dateIn, dateOut, userId, creatorType) values(?,?,?,?,?)',[roomId,dateIn,dateOut,userId,creatorType],[month,year], (err, rows, fields) => {
              if (err) {
                logger.error("Error while posting reservation\n", err);
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

//EPIC 2.5
  router.delete('/deleteEvent', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let reservationId = req.body['reservationId'];
            // if there is no issue obtaining a connection, execute query
            connection.query('DELETE FROM reservations where reservationId = (?)',reservationId, (err, rows, fields) => {
              if (err) {
                logger.error("Error while deleting event\n", err);
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

  router.post('/addCovidContact', async (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
            // if there is no issue obtaining a connection, execute query
            let userIdA = req.body['userIdA'];
            let userIdB = req.body['userIdB'];
            connection.query('INSERT INTO covidContacts (userIdA,userIdB) values(?,?)',[userIdA,userIdB], (err, rows, fields) => {
              if (err) {
                logger.error("Error while inserting covid contact \n", err);
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
            let userId = req.body['userId'];
            connection.query('SELECT * [except userPassword] FROM users WHERE userId IN (SELECT DISTINCT userIdB FROM covidContacts WHERE userIdA = (?))',userId,(err, rows, fields) => {
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

  // GET /api/getMyInbox
  //returns all the messages directed to user
  router.get('/api/getMyInbox', (req, res) => {

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
              sql = 'SELECT * FROM inbox WHERE recipientId = ' + row[0]["userId"];
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

  // GET /api/getMySentMessages
  //returns all the messages sent by user
  router.get('/api/getMySentMessages', (req, res) => {

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
              sql = 'SELECT * FROM inbox WHERE senderId = ' + row[0]["userId"];
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

  module.exports = router;