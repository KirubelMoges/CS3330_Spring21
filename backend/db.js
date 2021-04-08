const mysql = require('mysql');

// mysql connection
/*
var pool = mysql.createPool({
  host: process.env.MYSQL_CLOUD_HOST || "covidplanner.cderbn4k7mvo.us-east-2.rds.amazonaws.com ",
  user: process.env.MYSQL_CLOUD_USER || "admin",
  password: process.env.MYSQL_CLOUD_PASS || "LJyAbUHZ5uQGnpDw9qD9",
  port: process.env.MYSQL_PORT || "3306",
  database: process.env.MYSQL_DB || "covidPlanner"
});
*/

var pool = mysql.createPool({
  host: "covidplanner.cderbn4k7mvo.us-east-2.rds.amazonaws.com",
  user:  "admin",
  password: "LJyAbUHZ5uQGnpDw9qD9",
  port: "3306",
  database: "covidPlanner"
});

module.exports = pool;
