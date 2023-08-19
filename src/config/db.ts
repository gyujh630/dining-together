const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'dbname',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
