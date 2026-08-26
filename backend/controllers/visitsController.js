/**
 * Controlador de visitas mensuales.
 * Cada visita de un usuario que NO es admin suma 1 al mes en curso.
 * El "reseteo" es automático: cada mes se guarda en su propia fila
 * (identificada como 'YYYY-MM'), así que el contador del mes nuevo
 * arranca en 0 sin necesidad de ningún proceso aparte.
 */

const pool = require('../config/db');

function currentMonthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

// ========================================
// Sumar una visita al mes en curso
// ========================================

const trackVisit = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.query(
      `INSERT INTO monthly_visits (month, count) VALUES (?, 1)
       ON DUPLICATE KEY UPDATE count = count + 1`,
      [currentMonthKey()]
    );

    res.status(204).send();
  } catch (err) {
    console.error('Error en trackVisit:', err);
    // No queremos que un fallo acá rompa la navegación del sitio.
    res.status(204).send();
  } finally {
    if (connection) connection.release();
  }
};

// ========================================
// Obtener el conteo del mes en curso (solo admin)
// ========================================

const getMonthlyVisits = async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT count FROM monthly_visits WHERE month = ?',
      [currentMonthKey()]
    );

    res.json({ month: currentMonthKey(), count: rows[0]?.count || 0 });
  } catch (err) {
    console.error('Error en getMonthlyVisits:', err);
    res.status(500).json({ error: 'Error al obtener las visitas mensuales' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { trackVisit, getMonthlyVisits };
