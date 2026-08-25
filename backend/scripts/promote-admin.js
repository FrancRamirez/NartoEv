/**
 * Promueve una cuenta existente a administrador.
 * Uso: npm run promote-admin -- admin@nartoev.com.ar
 */

const pool = require('../config/db');

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error('Uso: npm run promote-admin -- correo@dominio.com');
  process.exitCode = 1;
} else {
  (async () => {
    try {
      const [result] = await pool.query(
        'UPDATE users SET role = ? WHERE email = ?',
        ['admin', email]
      );

      if (result.affectedRows === 0) {
        console.error('No existe una cuenta con ese email. Regístrala primero.');
        process.exitCode = 1;
        return;
      }

      console.log(`Cuenta promovida a admin: ${email}`);
    } catch (error) {
      console.error('No se pudo actualizar el rol:', error.message);
      process.exitCode = 1;
    } finally {
      await pool.end();
    }
  })();
}