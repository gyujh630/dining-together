import mysql from 'mysql2/promise';
import 'dotenv/config';
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env || 'ERROR';

const pool = mysql.createPool({
  connectionLimit: 30,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

export default pool;
