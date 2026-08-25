/**
 * Aplicación Express - configuración de middleware y rutas
 * (sin app.listen, para poder reutilizarla tanto en local como en Vercel)
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const publicationsRoutes = require('./routes/publications');

// Crear aplicación Express
const app = express();

// ========================================
// Middleware
// ========================================

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const isLocalDevelopment = !origin
      || origin === 'null'
      || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isLocalDevelopment || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// ========================================
// Rutas
// ========================================

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/publications', publicationsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
