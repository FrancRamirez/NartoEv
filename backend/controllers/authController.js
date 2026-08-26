/**
 * Controlador de autenticación
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ========================================
// Registro de usuario
// ========================================

const signup = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { nombre, email, password, password_confirm } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password || !password_confirm) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password !== password_confirm) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    // Verificar si el email ya existe
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const [result] = await connection.query(
      'INSERT INTO users (nombre, email, password, role) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      userId: result.insertId,
      email: email
    });
  } catch (err) {
    console.error('Error en signup:', err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Login de usuario
// ========================================

const login = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Buscar usuario
    const [users] = await connection.query(
      'SELECT id, nombre, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, nombre: user.nombre, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Sesión iniciada correctamente',
      token: token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Verificar token
// ========================================

const verify = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await connection.query(
      'SELECT id, nombre, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Token válido',
      user: users[0]
    });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { signup, login, verify };
