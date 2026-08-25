/**
 * Script de inicialización de base de datos
 * Crea las tablas necesarias si no existen
 */

const pool = require('../config/db');

const initDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('Inicializando base de datos...');

    // Tabla de usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);
    console.log('✓ Tabla "users" creada/verificada');

    // Tabla de publicaciones (trabajos de instalación realizados)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS publications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      )
    `);
    console.log('✓ Tabla "publications" creada/verificada');

    // Tabla de imágenes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255),
        orden INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES publications(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      )
    `);
    console.log('✓ Tabla "images" creada/verificada');

    // Tabla de videos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        titulo VARCHAR(100),
        tipo ENUM('youtube', 'vimeo', 'archivo') DEFAULT 'youtube',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES publications(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      )
    `);
    console.log('✓ Tabla "videos" creada/verificada');

    console.log('\n✅ Base de datos inicializada correctamente');
  } catch (err) {
    console.error('✗ Error al inicializar base de datos:', err.message);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = initDatabase;
