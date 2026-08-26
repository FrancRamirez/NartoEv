/**
 * Configuración de conexión a MySQL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.DB_HOST || 'localhost';
const isLocalDatabase = ['localhost', '127.0.0.1', '::1'].includes(host);
const useSsl = process.env.DB_SSL === 'true'
  || (process.env.DB_SSL !== 'false' && !isLocalDatabase);

const pool = mysql.createPool({
  host,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'narto_db',
  // Las bases locales de MySQL normalmente no usan TLS. Las remotas siguen
  // usando TLS por defecto, salvo que DB_SSL=false lo indique explícitamente.
  ...(useSsl ? {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

module.exports = pool;
