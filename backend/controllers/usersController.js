/**
 * Controlador de usuarios
 */

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// ========================================
// Obtener todos los usuarios (solo admin)
// ========================================

const getAllUsers = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    // Verificar si es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para ver usuarios' });
    }

    const [users] = await connection.query(
      'SELECT id, nombre, email, role, created_at FROM users'
    );

    res.json({
      message: 'Usuarios obtenidos',
      users: users
    });
  } catch (err) {
    console.error('Error en getAllUsers:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Obtener usuario por ID
// ========================================

const getUserById = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;

    // Verificar permiso: solo el usuario o admin pueden ver su perfil
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para ver este usuario' });
    }

    const [users] = await connection.query(
      'SELECT id, nombre, email, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario obtenido',
      user: users[0]
    });
  } catch (err) {
    console.error('Error en getUserById:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Actualizar usuario
// ========================================

const updateUser = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Verificar permiso
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para editar este usuario' });
    }

    // Un admin no puede editar su propia cuenta desde el panel de administración
    if (req.user.role === 'admin' && req.user.id === parseInt(id, 10)) {
      return res.status(400).json({ error: 'No podés modificar tu propia cuenta desde este panel.' });
    }

    // Validar que al menos un campo esté presente
    if (!nombre && !email && !password) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    let updateQuery = 'UPDATE users SET ';
    let values = [];

    if (nombre) {
      updateQuery += 'nombre = ?, ';
      values.push(nombre);
    }

    if (email) {
      updateQuery += 'email = ?, ';
      values.push(email);
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += 'password = ?, ';
      values.push(hashedPassword);
    }

    // Remover la última coma
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ' WHERE id = ?';
    values.push(id);

    const [result] = await connection.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('Error en updateUser:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Eliminar usuario
// ========================================

const deleteUser = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;

    // Verificar permiso: solo admin puede eliminar usuarios
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para eliminar usuarios' });
    }

    // Un admin no puede eliminar su propia cuenta
    if (req.user.id === parseInt(id, 10)) {
      return res.status(400).json({ error: 'No podés eliminar tu propia cuenta.' });
    }

    const [targetRows] = await connection.query('SELECT role FROM users WHERE id = ?', [id]);
    if (targetRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si el usuario a eliminar es admin, verificar que no sea el último
    if (targetRows[0].role === 'admin') {
      const [[{ total }]] = await connection.query(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'"
      );
      if (total <= 1) {
        return res.status(400).json({ error: 'No se puede eliminar: debe existir al menos una cuenta admin.' });
      }
    }

    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error en deleteUser:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Cambiar rol de usuario (solo admin)
// ========================================

const updateUserRole = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'El rol debe ser admin o user' });
    }

    // Un admin no puede modificar su propio rol (ni quitarlo ni reafirmarlo) desde este panel
    if (req.user.id === parseInt(id, 10)) {
      return res.status(400).json({ error: 'No podés modificar tu propio rol de administrador.' });
    }

    // Si se va a quitar el rol admin, verificar que no sea el último admin
    if (role !== 'admin') {
      const [targetRows] = await connection.query('SELECT role FROM users WHERE id = ?', [id]);
      if (targetRows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (targetRows[0].role === 'admin') {
        const [[{ total }]] = await connection.query(
          "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'"
        );
        if (total <= 1) {
          return res.status(400).json({ error: 'No se puede quitar: debe existir al menos una cuenta admin.' });
        }
      }
    }

    const [result] = await connection.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol actualizado correctamente', role });
  } catch (err) {
    console.error('Error en updateUserRole:', err);
    res.status(500).json({ error: 'Error al actualizar el rol' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getAllUsers, getUserById, updateUser, updateUserRole, deleteUser };
