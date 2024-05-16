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
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Anmol@594381',
  database: process.env.DB_NAME || 'unitradeDatabase',
  port: process.env.DB_PORT || 3306,
  // host: '127.0.0.1',
  // user: 'root',
  // password: 'Anmol@594381',
  // database: 'unitradeDatabase',
  // port: 3306,
});

module.exports = connection;

