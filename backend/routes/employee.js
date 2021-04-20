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
              let month = req.query['month'];
              let year = req.query['year'];
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
              let month = req.query['month'];
              let year = req.query['year'];
            // if there is no issue obtaining a connection, execute query
            connection.query('SELECT * FROM reservations WHERE MONTH(dateIn) = (?) AND YEAR(dateIn) = (?)',[month,year], (err, rows, fields) => {
              if (err) {
                logger.error("Error while fetching reservations\n", err);
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
  router.post('/reservation', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let roomId = req.query['roomId'];
              let dateIn = req.query['dateIn'];
              let dateOut = req.query['dateOut'];
              let userId = req.query['userId'];
              let creatorType = req.query['creatorType'];
            // if there is no issue obtaining a connection, execute query
            connection.query('INSERT INTO reservations (roomId, dateIn, dateOut, userId, creatorType) values(?,?,?,?,?)',[roomId,dateIn,dateOut,userId,creatorType], (err, rows, fields) => {
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
  router.delete('/reservation', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let reservationId = req.query['reservationId'];
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