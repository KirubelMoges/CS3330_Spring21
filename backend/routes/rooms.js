const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');
const secret = 'covidPlannerDB';
const crypto = require('crypto');

// POST /api/rooms
//adds new room to the rooms
router.post('/rooms', (req, res) => {

    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection){
        if(err){
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection',err)
            res.status(400).send('Problem obtaining MySQL connection'); 
        } else {
            let userEmail = req.body["userEmail"];
            let userPassword = req.body["userPassword"];
            let roomId = req.body["roomId"];
            let roomType = req.body["roomType"];
            let capacity = req.body["capacity"];
            let currentEmployees = 0;
            let availability = req.body["availability"];
            let cleaned = req.body["cleaned"];
            let beingCleaned = req.body["beingCleaned"];
            const hash = crypto.createHmac('sha256', secret).update(userPassword).digest('hex');
            //credential check and returns back all requests with the necessary information needed to approve or deny the request
            let sql = 'SELECT userId, jobTitle FROM users WHERE userEmail = \'' + userEmail + '\' AND userPassword=\'' + hash + '\'';
            let values = [
                [roomId, roomType, capacity, currentEmployees, availability, cleaned, beingCleaned]
            ];
            connection.query(sql, function (err, rows, fields) {
                if (err) {
                    logger.error("Error while fetching values: \n", err);
                    res.status(400).json({
                        "data": [],
                        "error": "Error obtaining values"
                    })
                } else { 
                    if(rows.length > 0){
                        if(rows[0]["jobTitle"]){
                            sql = 'INSERT INTO rooms(roomId, roomType, capacity, currentEmployees, availability, cleaned, beingCleaned) VALUES ?';
                            connection.query(sql, [values], function (err, rows, fields) {
                                connection.release();
                                if (err) {
                                    logger.error("Error while fetching values: \n", err);
                                    res.status(400).json({
                                        "data": [],
                                        "error": "Error obtaining values"
                                    })
                                } else { 
                                    //successful insert
                                    res.status(200).json({
                                        "status" : 0
                                    })
                                }
                            });
                        }
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


// GET /api/rooms
//returns all the rooms in the database
router.get('/rooms', (req, res) => {
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



module.exports = router;