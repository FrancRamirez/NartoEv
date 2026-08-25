/**
 * Rutas de autenticación
 */

const express = require('express');
const { signup, login, verify } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/signup - Registrar usuario
router.post('/signup', signup);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// GET /api/auth/verify - Verificar token
router.get('/verify', verify);

module.exports = router;
