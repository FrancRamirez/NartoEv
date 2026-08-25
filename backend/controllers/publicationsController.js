/**
 * Controlador de publicaciones
 */

const pool = require('../config/db');

// ========================================
// Crear publicación
// ========================================

const createPublication = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { nombre, descripcion } = req.body;
    const userId = req.user.id;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la publicación es requerido' });
    }

    const [result] = await connection.query(
      'INSERT INTO publications (user_id, nombre, descripcion) VALUES (?, ?, ?)',
      [userId, nombre, descripcion || null]
    );

    await savePublicationMedia(connection, result.insertId, req.files);

    res.status(201).json({
      message: 'Publicación creada correctamente',
      publicationId: result.insertId
    });
  } catch (err) {
    console.error('Error en createPublication:', err);
    res.status(500).json({ error: 'Error al crear publicación' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Obtener publicaciones del usuario
// ========================================

const getUserPublications = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const userId = req.user.id;

    const [publications] = await connection.query(
      'SELECT * FROM publications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    for (const publication of publications) {
      const [images] = await connection.query(
        "SELECT id, 'imagen' AS tipo, url, alt_text AS titulo, orden FROM images WHERE product_id = ? ORDER BY orden ASC",
        [publication.id]
      );
      const [videos] = await connection.query(
        "SELECT id, 'video' AS tipo, url, titulo, 0 AS orden FROM videos WHERE product_id = ? ORDER BY id ASC",
        [publication.id]
      );
      publication.media = [...images, ...videos];
    }

    res.json({
      message: 'Publicaciones obtenidas',
      publications: publications
    });
  } catch (err) {
    console.error('Error en getUserPublications:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  } finally {
    if (connection) connection.release();
  }
};

const getPublicPublications = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [publications] = await connection.query(
      'SELECT id, nombre, descripcion, created_at FROM publications ORDER BY created_at DESC'
    );

    for (const publication of publications) {
      const [images] = await connection.query(
        "SELECT id, 'imagen' AS tipo, url, alt_text AS titulo, orden FROM images WHERE product_id = ? ORDER BY orden ASC",
        [publication.id]
      );
      const [videos] = await connection.query(
        "SELECT id, 'video' AS tipo, url, titulo, 0 AS orden FROM videos WHERE product_id = ? ORDER BY id ASC",
        [publication.id]
      );
      publication.media = [...images, ...videos];
    }

    res.json({ publications });
  } catch (err) {
    console.error('Error en getPublicPublications:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones públicas' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Obtener publicación por ID
// ========================================

const getPublicationById = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;
    const userId = req.user.id;

    const [publications] = await connection.query(
      'SELECT * FROM publications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (publications.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Obtener imágenes asociadas
    const [images] = await connection.query(
      'SELECT * FROM images WHERE product_id = ? ORDER BY orden ASC',
      [id]
    );

    // Obtener videos asociados
    const [videos] = await connection.query(
      'SELECT * FROM videos WHERE product_id = ?',
      [id]
    );

    res.json({
      message: 'Publicación obtenida',
      publication: { ...publications[0], images, videos }
    });
  } catch (err) {
    console.error('Error en getPublicationById:', err);
    res.status(500).json({ error: 'Error al obtener publicación' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Actualizar publicación
// ========================================

const updatePublication = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const userId = req.user.id;

    // Verificar que la publicación pertenece al usuario
    const [publications] = await connection.query(
      'SELECT id FROM publications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (publications.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const updateValues = [];
    let updateQuery = 'UPDATE publications SET ';

    if (nombre !== undefined) {
      updateQuery += 'nombre = ?, ';
      updateValues.push(nombre);
    }
    if (descripcion !== undefined) {
      updateQuery += 'descripcion = ?, ';
      updateValues.push(descripcion);
    }
    if (updateValues.length === 0) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ?';
    updateValues.push(id);

    await connection.query(updateQuery, updateValues);

    if (req.files?.length) {
      await connection.query('DELETE FROM images WHERE product_id = ?', [id]);
      await connection.query('DELETE FROM videos WHERE product_id = ?', [id]);
      await savePublicationMedia(connection, id, req.files);
    }

    res.json({ message: 'Publicación actualizada correctamente' });
  } catch (err) {
    console.error('Error en updatePublication:', err);
    res.status(500).json({ error: 'Error al actualizar publicación' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Eliminar publicación
// ========================================

const deletePublication = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;
    const userId = req.user.id;

    // Verificar que la publicación pertenece al usuario
    const [publications] = await connection.query(
      'SELECT id FROM publications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (publications.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    // Eliminar imágenes y videos asociados
    await connection.query('DELETE FROM images WHERE product_id = ?', [id]);
    await connection.query('DELETE FROM videos WHERE product_id = ?', [id]);

    // Eliminar publicación
    await connection.query('DELETE FROM publications WHERE id = ?', [id]);

    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error('Error en deletePublication:', err);
    res.status(500).json({ error: 'Error al eliminar publicación' });
  } finally {
    if (connection) connection.release();
  }
};

async function savePublicationMedia(connection, publicationId, files = []) {
  for (const [index, file] of files.entries()) {
    const url = `/uploads/${file.filename}`;
    if (file.mimetype.startsWith('image/')) {
      await connection.query(
        'INSERT INTO images (product_id, url, alt_text, orden) VALUES (?, ?, ?, ?)',
        [publicationId, url, file.originalname, index]
      );
    } else if (file.mimetype.startsWith('video/')) {
      await connection.query(
        'INSERT INTO videos (product_id, url, titulo, tipo) VALUES (?, ?, ?, ?)',
        [publicationId, url, file.originalname, 'archivo']
      );
    }
  }
}

module.exports = { createPublication, getUserPublications, getPublicPublications, getPublicationById, updatePublication, deletePublication };
