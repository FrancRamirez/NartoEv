/**
 * Script de prueba: verifica si una contraseña coincide con el hash
 * guardado en la base, sin necesidad de compartir la contraseña con nadie.
 *
 * Uso:
 *   1. Ubicate en la carpeta backend/ de tu proyecto (donde está instalado bcryptjs)
 *   2. Copiá este archivo ahí como test-password.js
 *   3. Corré: node test-password.js
 *   4. Escribí tu contraseña cuando te la pida
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const HASH_GUARDADO = '$2a$10$q9G2iN1i1CWiPGjhhYOdJuypv5.XtlHdaW5cDVEO3NxjjGsx4Ek4u';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Ingresá la contraseña de info@narto.biz para probar: ', async (password) => {
  const coincide = await bcrypt.compare(password, HASH_GUARDADO);
  console.log(coincide ? '✅ COINCIDE' : '❌ NO coincide');
  rl.close();
});
