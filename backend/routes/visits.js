/**
 * Rutas de visitas mensuales
 */

const express = require('express');
const authMiddleware = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { trackVisit, getMonthlyVisits } = require('../controllers/visitsController');

const router = express.Router();

// POST /api/visits/track - Sumar una visita, sin autenticación
// (el frontend decide si llamarla o no según el rol del visitante)
router.post('/track', trackVisit);

// GET /api/visits/monthly - Ver el conteo del mes en curso (solo admin)
router.get('/monthly', authMiddleware, requireAdmin, getMonthlyVisits);

module.exports = router;
