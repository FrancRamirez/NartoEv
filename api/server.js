/**
 * Punto de entrada para Vercel.
 * Una app de Express ya es una función (req, res) => {...} válida,
 * así que Vercel puede invocarla directamente, sin adaptadores.
 */

const app = require('../backend/app');

module.exports = app;
