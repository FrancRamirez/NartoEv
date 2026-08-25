/**
 * Rutas de usuarios
 */

const express = require('express');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { getAllUsers, getUserById, updateUser, updateUserRole, deleteUser } = require('../controllers/usersController');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', requireAdmin, getAllUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', updateUser);

// PATCH /api/users/:id/role - Cambiar rol (solo admin)
router.patch('/:id/role', requireAdmin, updateUserRole);

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
