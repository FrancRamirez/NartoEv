/**
 * Lógica de Autenticación - Login/Registro
 * Usa ruta relativa /api, funciona igual en local y en producción.
 */

const API_URL = '/api';

// Elementos del DOM
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const loadingIndicator = document.getElementById('loading-indicator');

// Funciones de utilidad
function showLoading(show = true) {
  loadingIndicator.style.display = show ? 'flex' : 'none';
}

function showError(containerId, message) {
  const errorElement = document.getElementById(containerId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function hideError(containerId) {
  const errorElement = document.getElementById(containerId);
  errorElement.style.display = 'none';
}

// Guardar token en localStorage
function setToken(token) {
  localStorage.setItem('authToken', token);
}

// Obtener token de localStorage
function getToken() {
  return localStorage.getItem('authToken');
}

// Limpiar token
function clearToken() {
  localStorage.removeItem('authToken');
}

function toggleForms(formType) {
  if (formType === 'signup') {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
    hideError('login-error');
  } else {
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
    hideError('signup-error');
  }
}

// Event listeners para cambiar entre login y registro
toggleButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    toggleForms(button.dataset.form);
  });
});

// ======================================================================
// FORMULARIO DE LOGIN - Conectado a Backend
// ======================================================================

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('login-error');
  showLoading(true);

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    // Valida inputs básicos
    if (!email || !password) {
      throw new Error('Por favor completa todos los campos');
    }

    if (!email.includes('@')) {
      throw new Error('Por favor ingresa un email válido');
    }

    // Conecta con el backend
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    // Login exitoso - guardar token
    setToken(data.token);
    console.log('✓ Sesión iniciada', data.user.email);
    showError('login-error', 'Sesión iniciada correctamente, redirigiendo...');
    document.getElementById('login-error').style.color = '#15803d';
    document.getElementById('login-error').style.background = 'rgba(34, 197, 94, 0.1)';
    document.getElementById('login-error').style.borderColor = 'rgba(34, 197, 94, 0.3)';

    // Redirige al dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);

  } catch (err) {
    console.error('Error en login:', err);
    const message = err instanceof TypeError
      ? 'No se puede contactar al servidor. Inicia el backend con "cd backend; npm run dev".'
      : (err.message || 'Error al iniciar sesión. Intenta de nuevo.');
    showError('login-error', message);
  } finally {
    showLoading(false);
  }
});

// ======================================================================
// FORMULARIO DE REGISTRO - Conectado a Backend
// ======================================================================

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('signup-error');
  showLoading(true);

  const nombre = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const password_confirm = document.getElementById('signup-password-confirm').value;

  try {
    // Valida inputs
    if (!nombre || !email || !password || !password_confirm) {
      throw new Error('Por favor completa todos los campos');
    }

    if (!email.includes('@')) {
      throw new Error('Por favor ingresa un email válido');
    }

    if (password.length < 8) {
      throw new Error('La contraseña debe tener mínimo 8 caracteres');
    }

    if (password !== password_confirm) {
      throw new Error('Las contraseñas no coinciden');
    }

    // Conecta con el backend
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, password, password_confirm })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear la cuenta');
    }

    // Registro exitoso
    console.log('✓ Cuenta creada', data.email);
    
    // Muestra mensaje de confirmación
    showError('signup-error', '✓ Cuenta creada correctamente. Por favor inicia sesión.');
    document.getElementById('signup-error').style.color = '#15803d';
    document.getElementById('signup-error').style.background = 'rgba(34, 197, 94, 0.1)';
    document.getElementById('signup-error').style.borderColor = 'rgba(34, 197, 94, 0.3)';

    // Limpia el formulario
    signupForm.reset();

    // Redirige a login después de 2 segundos
    setTimeout(() => {
      toggleForms('login');
      loginForm.reset();
    }, 2000);

  } catch (err) {
    console.error('Error en registro:', err);
    const message = err instanceof TypeError
      ? 'No se puede contactar al servidor. Inicia el backend con "cd backend; npm run dev".'
      : (err.message || 'Error al crear la cuenta. Intenta de nuevo.');
    showError('signup-error', message);
  } finally {
    showLoading(false);
  }
});


// ======================================================================
// Verificar si el usuario ya tiene sesión
// ======================================================================

async function checkAuthStatus() {
  try {
    const token = getToken();
    
    if (token) {
      console.log('Usuario autenticado');
      // Si ya está autenticado, redirige al dashboard
      // window.location.href = 'dashboard.html';
    }
  } catch (err) {
    console.error('Error al verificar autenticación:', err);
  }
}

// Ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', checkAuthStatus);