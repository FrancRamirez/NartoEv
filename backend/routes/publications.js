/**
 * Rutas de publicaciones
 */

const express = require('express');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const upload = require('../middleware/upload');
const { 
  createPublication, 
  getUserPublications, 
  getPublicPublications,
  getPublicationById, 
  updatePublication, 
  deletePublication 
} = require('../controllers/publicationsController');

const router = express.Router();

// GET /api/publications/public - Listado público, sin autenticación
router.get('/public', getPublicPublications);

// Todas las rutas requieren autenticación
router.use(authMiddleware, requireAdmin);

// POST /api/publications - Crear publicación
router.post('/', upload.array('media', 12), createPublication);

// GET /api/publications - Obtener publicaciones del usuario
router.get('/', getUserPublications);

// GET /api/publications/:id - Obtener publicación por ID
router.get('/:id', getPublicationById);

// PUT /api/publications/:id - Actualizar publicación
router.put('/:id', upload.array('media', 12), updatePublication);

// DELETE /api/publications/:id - Eliminar publicación
router.delete('/:id', deletePublication);

module.exports = router;
