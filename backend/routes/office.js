const express = require('express');
const router = express.Router();
const { json } = require('body-parser');
const pool = require('../db');
const crypto = require('crypto');
const secret = 'covidPlannerDB';

// POST /api/createOffice
//creates new Office
router.post('/createOffice', (req, res) => {

// obtain a connection from our pool of connections
pool.getConnection(function (err, connection) {
    if (err) {
    // if there is an issue obtaining a connection, release the connection instance and log the error
    logger.error('Problem obtaining MySQL connection', err);
    res.status(400).send('Problem obtaining MySQL connection');
    } else {
    let city = req.body['city'];
    let state = req.body['state'];
    let countryCode = req.body['countryCode'];
    let insert = [[city, state, countryCode]];
    let sql = 'INSERT INTO offices(city, state, countryCode) VALUES ?';
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
        res.status(200).json({
            data: rows
        });
        }
    });
    }
});
});


// GET /api/office
//get specific information about an office
router.get('/office', (req, res) => {
    // obtain a connection from our pool of connections
    pool.getConnection(function (err, connection) {
        if (err) {
            // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err);
            res.status(400).send('Problem obtaining MySQL connection');
        } else {
            let officeid = req.query['officeId'];
            let sql = 'SELECT * FROM offices WHERE officeId = ?';
            // if there is no issue obtaining a connection, execute query and release connection
            connection.query(sql, officeid, function (err, rows, fields) {
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

// get /api/offices
// get all office information
router.get('/offices', (req, res) => {

    // obtain a connection from our pool of connections
    pool.getConnection(async function (err, connection) {
        if (err) {
        // if there is an issue obtaining a connection, release the connection instance and log the error
            logger.error('Problem obtaining MySQL connection', err);
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

  module.exports = router;