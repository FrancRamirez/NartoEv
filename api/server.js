/**
 * Punto de entrada para Vercel (función serverless)
 * Envuelve la app de Express existente con serverless-http.
 */

const serverless = require('serverless-http');
const app = require('../backend/app');

module.exports = serverless(app);
