const mysql = require('mysql');

var pool = mysql.createPool({
  host: 'covidplanner.cderbn4k7mvo.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'LJyAbUHZ5uQGnpDw9qD9',
  port: '3306',
  database: 'covidPlanner'
});


// mysql connection
/*
var pool = mysql.createPool({
  host: process.env.MYSQL_CLOUD_HOST,
  user: process.env.MYSQL_CLOUD_USER,
  password: process.env.MYSQL_CLOUD_PASS,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB
});
*/

module.exports = pool;
