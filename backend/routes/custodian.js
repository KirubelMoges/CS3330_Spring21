const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.raw());

//EPIC 9.1
router.get('/getRoomsToBeCleaned', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
            // if there is no issue obtaining a connection, execute query
            connection.query('SELECT * FROM rooms WHERE cleaned = 0', (err, rows, fields) => {
              if (err) {
                logger.error("Error while updating cleanedId in room\n", err);
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

router.put('/markRoomAsCleaned', (req,res) => {
    pool.getConnection((err,connection) => {
        if (err){
            console.log(connection);
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err)
            res.status(400).send('Problem obtaining MySQL connection'); 
          } else
          {
              let roomId = req.query['roomId'];
              let lastCleaned = req.query['lastCleaned'];
            // if there is no issue obtaining a connection, execute query
            connection.query('UPDATE rooms SET cleaned = 1 , lastCleaned = (?) WHERE roomId = (?)',[lastCleaned,roomId], (err, rows, fields) => {
              if (err) {
                logger.error("Error while updating cleaned room\n", err);
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

  //EPIC 9.5
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

  module.exports = router;