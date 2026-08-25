/**
 * Lógica del Dashboard
 * Usa ruta relativa /api, funciona igual en local y en producción.
 */

const API_URL = '/api';

// Obtener token de localStorage
function getToken() {
  return localStorage.getItem('authToken');
}

// Limpiar token
function clearToken() {
  localStorage.removeItem('authToken');
}

// Hacer request autenticado
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado
      clearToken();
      window.location.href = 'auth.html';
    }
    const data = await response.json();
    throw new Error(data.error || 'Error en la solicitud');
  }

  return response.json();
}

// ======================================================================
// Verificar autenticación y mostrar información del usuario
// ======================================================================

let currentUserId = null;

async function initDashboard() {
  try {
    const token = getToken();

    if (!token) {
      console.log('Usuario no autenticado, redirigiendo a login');
      window.location.href = 'auth.html';
      return;
    }

    // Verificar que el token sea válido
    const authData = await apiRequest('/auth/verify');
    const user = authData.user;

    if (user.role !== 'admin') {
      clearToken();
      alert('Tu cuenta no tiene permisos para acceder al panel de administración.');
      window.location.href = 'index.html';
      return;
    }

    currentUserId = user.id;

    // Muestra el email del usuario
    const userEmailEl = document.getElementById('user-email');
    userEmailEl.textContent = user.email;

    await Promise.all([loadPublications(), loadUsers()]);

    console.log('✓ Dashboard cargado para:', user.email);
  } catch (err) {
    console.error('Error al verificar autenticación:', err);
    clearToken();
    window.location.href = 'auth.html';
  }
}

async function loadPublications() {
  const publicationsGrid = document.getElementById('publications-grid');
  const publicationCount = document.getElementById('publication-count');

  try {
    const data = await apiRequest('/publications');
    const publications = data.publications || [];
    publicationCount.textContent = publications.length;

    if (publications.length === 0) {
      publicationsGrid.innerHTML = '<div class="empty-state">Todavía no hay publicaciones.</div>';
      return;
    }

    publicationsGrid.innerHTML = publications.map(publication => `
      <article class="publication-tile">
        ${renderMediaGallery(publication.media, `publicacion-${publication.id}`)}
        <div class="publication-tile-body">
          <strong>${escapeHtml(publication.nombre)}</strong>
          <p>${escapeHtml(publication.descripcion || 'Sin descripción')}</p>
        </div>
        <div class="tile-actions">
          <button class="table-action edit-publication" data-publication-id="${publication.id}">Editar</button>
          <button class="table-action delete-publication" data-publication-id="${publication.id}">Eliminar</button>
        </div>
      </article>
    `).join('');

    publicationsGrid.querySelectorAll('.edit-publication').forEach(button => {
      button.addEventListener('click', () => editPublication(publications.find(publication => publication.id === Number(button.dataset.publicationId))));
    });
    publicationsGrid.querySelectorAll('.delete-publication').forEach(button => {
      button.addEventListener('click', () => deletePublication(button.dataset.publicationId));
    });
  } catch (error) {
    publicationsGrid.innerHTML = '<div class="empty-state">No se pudieron cargar las publicaciones.</div>';
  }
}

async function savePublication(event) {
  event.preventDefault();
  const id = document.getElementById('publication-id').value;
  const payload = new FormData();
  payload.append('nombre', document.getElementById('publication-name').value.trim());
  payload.append('descripcion', document.getElementById('publication-description').value.trim());
  for (const file of document.getElementById('publication-media').files) payload.append('media', file);

  try {
    await apiRequest(id ? `/publications/${id}` : '/publications', {
      method: id ? 'PUT' : 'POST',
      body: payload
    });
    resetPublicationForm();
    await loadPublications();
  } catch (error) {
    document.getElementById('publication-form-message').textContent = error.message;
  }
}

function editPublication(publication) {
  document.getElementById('publication-id').value = publication.id;
  document.getElementById('publication-name').value = publication.nombre;
  document.getElementById('publication-description').value = publication.descripcion || '';
  document.getElementById('publication-media').value = '';
  renderFilePreview('publication-media-preview', []);
  document.getElementById('publication-form').hidden = false;
  document.getElementById('publication-name').focus();
}

async function deletePublication(id) {
  if (!window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
  try {
    await apiRequest(`/publications/${id}`, { method: 'DELETE' });
    await loadPublications();
  } catch (error) {
    window.alert(error.message);
  }
}

function resetPublicationForm() {
  document.getElementById('publication-form').reset();
  document.getElementById('publication-id').value = '';
  document.getElementById('publication-form').hidden = true;
  document.getElementById('publication-form-message').textContent = '';
}

function setupFileDropzone(dropzoneSelector, inputId, previewId) {
  const dropzone = document.querySelector(`[data-file-dropzone="${dropzoneSelector}"]`);
  const input = document.getElementById(inputId);
  if (!dropzone || !input) return;

  dropzone.addEventListener('click', event => {
    if (event.target !== input) input.click();
  });
  input.addEventListener('change', () => renderFilePreview(previewId, [...input.files]));
  ['dragenter', 'dragover'].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  }));
  ['dragleave', 'drop'].forEach(type => dropzone.addEventListener(type, event => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
  }));
  dropzone.addEventListener('drop', event => {
    const files = [...event.dataTransfer.files]
      .filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .slice(0, 12);
    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
    renderFilePreview(previewId, files);
  });
}

function renderFilePreview(previewId, files) {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  preview.innerHTML = files.map(file => `<span>${escapeHtml(file.name)}</span>`).join('');
}

function getMediaUrl(url) {
  if (!url) return '';
  return url;
}

function renderMediaGallery(media = [], label) {
  if (!media.length) return '<div class="media-gallery media-gallery-empty">Sin imágenes ni videos</div>';

  return `<div class="media-gallery" aria-label="Galería de ${label}">
    ${media.map((item, index) => {
      const url = getMediaUrl(item.url);
      if (item.tipo === 'video') {
        return `<video class="media-item" controls preload="metadata" title="Video ${index + 1}"><source src="${escapeHtml(url)}"></video>`;
      }
      return `<img class="media-item" src="${escapeHtml(url)}" alt="${escapeHtml(item.titulo || `${label} ${index + 1}`)}" loading="lazy">`;
    }).join('')}
  </div>`;
}

async function loadUsers() {
  const usersBody = document.getElementById('users-table-body');
  const clientCount = document.getElementById('client-count');

  try {
    const data = await apiRequest('/users');
    const users = data.users || [];
    clientCount.textContent = users.filter(user => user.role !== 'admin').length;

    if (users.length === 0) {
      usersBody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay usuarios registrados.</td></tr>';
      return;
    }

    usersBody.innerHTML = users.map(user => renderUserRow(user, users)).join('');
    attachUserRowListeners(users);
  } catch (error) {
    usersBody.innerHTML = '<tr><td colspan="6" class="empty-state">No se pudieron cargar los usuarios.</td></tr>';
  }
}

function renderUserRow(user, allUsers) {
  const isSelf = user.id === currentUserId;
  const adminCount = allUsers.filter(u => u.role === 'admin').length;
  const isLastAdmin = user.role === 'admin' && adminCount <= 1;
  const locked = isSelf || isLastAdmin;
  const lockReason = isSelf
    ? 'No podés modificar ni eliminar tu propia cuenta'
    : 'Debe existir al menos una cuenta admin';

  return `
    <tr data-user-id="${user.id}">
      <td>${user.id}</td>
      <td>${escapeHtml(user.nombre)}${isSelf ? ' <span class="self-tag">(vos)</span>' : ''}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>••••••••</td>
      <td><span class="role-badge role-${user.role}">${user.role}</span></td>
      <td class="tile-actions">
        <button class="table-action" data-action="modify" data-user-id="${user.id}" ${locked ? `disabled title="${lockReason}"` : ''}>Modificar</button>
        <button class="table-action table-action-danger" data-action="delete" data-user-id="${user.id}" ${locked ? `disabled title="${lockReason}"` : ''}>Eliminar</button>
      </td>
    </tr>
  `;
}

function renderUserRowEditing(user, allUsers) {
  const adminCount = allUsers.filter(u => u.role === 'admin').length;
  const isLastAdmin = user.role === 'admin' && adminCount <= 1;

  return `
    <tr data-user-id="${user.id}" class="is-editing">
      <td>${user.id}</td>
      <td><input class="row-edit-input" data-field="nombre" value="${escapeHtml(user.nombre)}"></td>
      <td><input class="row-edit-input" type="email" data-field="email" value="${escapeHtml(user.email)}"></td>
      <td><input class="row-edit-input" type="password" data-field="password" placeholder="Dejar en blanco para no cambiar"></td>
      <td><span class="role-badge role-${user.role}">${user.role}</span></td>
      <td class="tile-actions">
        <button class="table-action" data-action="toggle-role" data-user-id="${user.id}" data-role="${user.role === 'admin' ? 'user' : 'admin'}" ${isLastAdmin ? 'disabled title="Debe existir al menos una cuenta admin"' : ''}>
          ${user.role === 'admin' ? 'Quitar Admin' : 'Asignar Admin'}
        </button>
        <button class="table-action" data-action="accept" data-user-id="${user.id}">Aceptar</button>
      </td>
    </tr>
  `;
}

function attachUserRowListeners(users) {
  const usersBody = document.getElementById('users-table-body');

  usersBody.querySelectorAll('[data-action="modify"]').forEach(button => {
    if (button.disabled) return;
    button.addEventListener('click', () => {
      const user = users.find(u => u.id === Number(button.dataset.userId));
      if (!user) return;
      const row = usersBody.querySelector(`tr[data-user-id="${user.id}"]`);
      row.outerHTML = renderUserRowEditing(user, users);
      attachUserRowListeners(users);
    });
  });

  usersBody.querySelectorAll('[data-action="delete"]').forEach(button => {
    if (button.disabled) return;
    button.addEventListener('click', () => removeUser(button.dataset.userId));
  });

  usersBody.querySelectorAll('[data-action="toggle-role"]').forEach(button => {
    if (button.disabled) return;
    button.addEventListener('click', () => changeUserRole(button.dataset.userId, button.dataset.role));
  });

  usersBody.querySelectorAll('[data-action="accept"]').forEach(button => {
    button.addEventListener('click', () => acceptUserEdit(button.dataset.userId));
  });
}

async function acceptUserEdit(userId) {
  const row = document.querySelector(`#users-table-body tr[data-user-id="${userId}"]`);
  if (!row) return;

  const nombre = row.querySelector('[data-field="nombre"]').value.trim();
  const email = row.querySelector('[data-field="email"]').value.trim();
  const password = row.querySelector('[data-field="password"]').value;

  if (password && password.length < 8) {
    window.alert('La contraseña debe tener mínimo 8 caracteres');
    return;
  }

  const payload = { nombre, email };
  if (password) payload.password = password;

  try {
    await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    await loadUsers();
  } catch (error) {
    window.alert(error.message);
  }
}

async function changeUserRole(userId, role) {
  const action = role === 'admin' ? 'otorgar' : 'quitar';
  if (!window.confirm(`¿Quieres ${action} el rol de administrador?`)) return;

  try {
    await apiRequest(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role })
    });
    await loadUsers();
  } catch (error) {
    window.alert(error.message);
  }
}

async function removeUser(userId) {
  if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;

  try {
    await apiRequest(`/users/${userId}`, { method: 'DELETE' });
    await loadUsers();
  } catch (error) {
    window.alert(error.message);
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

// ======================================================================
// Cerrar sesión
// ======================================================================

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', async () => {
  try {
    clearToken();
    console.log('✓ Sesión cerrada');
    window.location.href = 'index.html';
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }
});

// ======================================================================
// Navegación entre secciones
// ======================================================================

const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    // Obtiene la sección a mostrar
    const sectionId = item.dataset.section;

    // Remueve la clase 'active' de todos los items
    navItems.forEach(nav => nav.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));

    // Agrega la clase 'active' al item clickeado y su sección
    item.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
  });
});

// Maneja botones de acciones rápidas
const actionBtns = document.querySelectorAll('.action-btn');
actionBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const sectionId = btn.dataset.section;
    const targetNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetNav) {
      targetNav.click();
    }
  });
});

document.getElementById('add-publication-btn').addEventListener('click', () => {
  document.getElementById('publication-form').hidden = false;
  document.getElementById('publication-name').focus();
});
document.getElementById('cancel-publication-btn').addEventListener('click', resetPublicationForm);
document.getElementById('publication-form').addEventListener('submit', savePublication);
setupFileDropzone('publication-media-dropzone', 'publication-media', 'publication-media-preview');

// ======================================================================
// Inicializa el dashboard
// ======================================================================

document.addEventListener('DOMContentLoaded', initDashboard);