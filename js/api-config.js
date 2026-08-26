/*
 * Punto único para la URL de la API.
 * En el dominio publicado se usa la ruta /api de Vercel. Al abrir el sitio
 * desde localhost, el backend de desarrollo corre en el puerto 5000.
 */
(function configureApiUrl() {
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
    || window.location.port === '3000';
  window.NARTO_API_URL = isLocal ? 'http://localhost:5000/api' : '/api';
})();
