// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "Anmol@594381",
//   database: "unitradeDatabase",
//   port:3306
// });

// module.exports = connection;



const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

module.exports = connection;

