const mysql = require("mysql");
require("dotenv").config();

// I put this here, so that I can use it across multiple files. Used to make SQL queries to DB
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

module.exports = con;
