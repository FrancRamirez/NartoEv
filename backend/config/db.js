/**
 * Configuración de conexión a MySQL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'narto_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
pool.getConnection()
  .then(connection => {
    console.log('✓ Conexión a MySQL exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Error al conectar a MySQL:', err.message);
    console.error('Asegúrate de que:');
    console.error('  1. MySQL está corriendo');
    console.error('  2. Los datos en .env son correctos');
    console.error('  3. La base de datos existe');
  });

module.exports = pool;
