/**
 * Punto de entrada para desarrollo local
 * (en Vercel se usa /api/index.js en su lugar, que reutiliza app.js)
 */

require('dotenv').config();

const app = require('./app');
const initDatabase = require('./config/init-db');

const PORT = process.env.API_PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`\n✓ Servidor iniciado en http://localhost:${PORT}`);
      console.log(`✓ API disponible en http://localhost:${PORT}/api\n`);
    });
  } catch (err) {
    console.error('✗ Error al iniciar el servidor:', err);
    process.exit(1);
  }
};

startServer();
