// Año dinámico en el footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
const API_URL = window.NARTO_API_URL || '/api';

// ======================================================================
// Sesión + conteo de visitas mensuales
// - Si ya hay un token válido guardado, el ícono de login lleva directo
//   al dashboard (y la verificación renueva el token: ventana deslizante
//   de 7 días desde el último uso, no desde el login).
// - Cualquier visitante que NO sea admin (esté logueado o no) suma 1
//   visita al contador del mes en curso, una sola vez por pestaña abierta.
// ======================================================================
(function checkSessionAndTrackVisit() {
  const loginIcon = document.querySelector('.btn-login');
  const token = localStorage.getItem('authToken');

  function trackVisitOnce() {
    if (sessionStorage.getItem('visitTracked')) return;
    sessionStorage.setItem('visitTracked', 'true');
    fetch(`${API_URL}/visits/track`, { method: 'POST' }).catch(() => {});
  }

  if (!token) {
    trackVisitOnce();
    return;
  }

  fetch(`${API_URL}/auth/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (loginIcon) {
        loginIcon.href = 'dashboard.html';
        loginIcon.title = 'Ir al panel';
        loginIcon.setAttribute('aria-label', 'Ir al panel de administración');
      }
      if (data.user?.role !== 'admin') {
        trackVisitOnce();
      }
    })
    .catch(() => {
      // Token inválido o vencido: lo limpiamos, el ícono sigue yendo a auth.html
      localStorage.removeItem('authToken');
      trackVisitOnce();
    });
})();

// Elementos "reveal": aparecen animados a medida que entran en pantalla
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" })
  : null;

function observeReveal(elements) {
  elements.forEach((el, index) => {
    if (el.dataset.revealObserved) return;
    el.dataset.revealObserved = "true";
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 0.08}s`;
    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  });
}

observeReveal(document.querySelectorAll(".reveal"));

const publicPublicationsGrid = document.getElementById('public-publications-grid');
if (publicPublicationsGrid) {
  const publicPublicationsUrl = `${API_URL}/publications/public`;
  const publicVideosGrid = document.getElementById('public-videos-grid');
  const publicVideosSlider = document.getElementById('public-videos-slider');
  const publicVideosTitle = document.getElementById('public-videos-title');

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const mediaUrl = url => url ?? '';

  fetch(publicPublicationsUrl)
    .then(response => {
      if (!response.ok) throw new Error('No se pudieron cargar las publicaciones');
      return response.json();
    })
    .then(({ publications }) => {
      const mediaByType = groupPublicationMedia(publications || []);
      if (!mediaByType.imagen.length && !mediaByType.video.length) {
        publicPublicationsGrid.innerHTML = '<p class="catalog-status">Próximamente encontrarás nuestras publicaciones aquí.</p>';
        return;
      }

      createMediaCarousel({
        grid: publicPublicationsGrid,
        leftArrow: document.getElementById('catalog-arrow-left'),
        rightArrow: document.getElementById('catalog-arrow-right'),
        items: mediaByType.imagen,
        type: 'imagen',
        emptyMessage: 'Próximamente encontrarás imágenes de nuestros trabajos aquí.'
      });

      if (mediaByType.video.length) {
        publicVideosTitle.hidden = false;
        publicVideosSlider.hidden = false;
        createMediaCarousel({
          grid: publicVideosGrid,
          leftArrow: document.getElementById('video-catalog-arrow-left'),
          rightArrow: document.getElementById('video-catalog-arrow-right'),
          items: mediaByType.video,
          type: 'video',
          emptyMessage: 'Próximamente encontrarás videos de nuestros trabajos aquí.'
        });
      }
    })
    .catch(() => {
      publicPublicationsGrid.innerHTML = '<p class="catalog-status">No se pudieron cargar las publicaciones.</p>';
      publicVideosGrid.innerHTML = '<p class="catalog-status">No se pudieron cargar los videos.</p>';
    });

  function groupPublicationMedia(publications) {
    return publications.reduce((groups, publication) => {
      (publication.media || []).forEach(media => {
        if (media.tipo === 'imagen' || media.tipo === 'video') {
          groups[media.tipo].push({ publication, media });
        }
      });
      return groups;
    }, { imagen: [], video: [] });
  }

  function createMediaCarousel({ grid, leftArrow, rightArrow, items, type, emptyMessage }) {
    if (!items.length) {
      grid.innerHTML = `<p class="catalog-status">${emptyMessage}</p>`;
      return;
    }

    grid.innerHTML = items.map(({ publication, media }) => {
      const url = mediaUrl(media.url);
      const mediaMarkup = type === 'video'
        ? `<video controls preload="metadata" aria-label="Video de ${escapeHtml(publication.nombre)}"><source src="${escapeHtml(url)}"></video>`
        : `<img src="${escapeHtml(url)}" alt="${escapeHtml(media.titulo || publication.nombre)}" loading="lazy">`;

      return `
        <article class="public-publication-card reveal" data-publication-name="${escapeHtml(publication.nombre)}" data-publication-description="${escapeHtml(publication.descripcion || 'Consultá por características y disponibilidad.')}">
          <div class="public-publication-media" data-image-area>
            ${mediaMarkup}
          </div>
          <div class="public-publication-content" data-details-area tabindex="0" role="button" aria-label="Ver detalle de ${escapeHtml(publication.nombre)}">
            <h3>${escapeHtml(publication.nombre)}</h3>
            <p>${escapeHtml(publication.descripcion || 'Consultá por características y disponibilidad.')}</p>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.public-publication-media img').forEach(image => {
      image.addEventListener('click', event => {
        event.stopPropagation();
        stopAutoScroll();
        openImageModal(image.src, image.alt);
      });
    });

    grid.querySelectorAll('[data-details-area]').forEach(details => {
      const openDetails = () => {
        stopAutoScroll();
        const card = details.closest('.public-publication-card');
        openDetailsModal(card.dataset.publicationName, card.dataset.publicationDescription);
      };
      details.addEventListener('click', openDetails);
      details.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetails();
        }
      });
    });

    observeReveal(grid.querySelectorAll('.reveal'));

    let autoScrollActive = true;
    let autoScrollFrame = null;
    const updateArrowVisibility = () => {
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      leftArrow.hidden = grid.scrollLeft <= 4;
      rightArrow.hidden = grid.scrollLeft >= maxScroll - 4;
    };
    const stopAutoScroll = () => {
      autoScrollActive = false;
      if (autoScrollFrame) cancelAnimationFrame(autoScrollFrame);
      autoScrollFrame = null;
    };
    const stepAutoScroll = () => {
      if (!autoScrollActive) return;
      const maxScroll = grid.scrollWidth - grid.clientWidth;
      if (maxScroll > 0) grid.scrollLeft = grid.scrollLeft >= maxScroll ? 0 : grid.scrollLeft + 0.6;
      updateArrowVisibility();
      autoScrollFrame = requestAnimationFrame(stepAutoScroll);
    };

    ['wheel', 'touchstart', 'pointerdown'].forEach(eventName => {
      grid.addEventListener(eventName, stopAutoScroll, { passive: true });
    });
    leftArrow.addEventListener('click', () => {
      stopAutoScroll();
      grid.scrollBy({ left: -520, behavior: 'smooth' });
      setTimeout(updateArrowVisibility, 350);
    });
    rightArrow.addEventListener('click', () => {
      stopAutoScroll();
      grid.scrollBy({ left: 520, behavior: 'smooth' });
      setTimeout(updateArrowVisibility, 350);
    });

    updateArrowVisibility();
    autoScrollFrame = requestAnimationFrame(stepAutoScroll);
  }


  const imageModal = document.getElementById('catalog-image-modal');
  const detailsModal = document.getElementById('catalog-details-modal');

  function openImageModal(src, alt) {
    const modalImage = document.getElementById('catalog-image-modal-content');
    modalImage.src = src;
    modalImage.alt = alt;
    imageModal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function openDetailsModal(title, description) {
    document.getElementById('catalog-details-title').textContent = title;
    document.getElementById('catalog-details-content').textContent = description;
    detailsModal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    modal.hidden = true;
    if (imageModal.hidden && detailsModal.hidden) document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => closeModal(button.closest('.catalog-modal')));
  });

  [imageModal, detailsModal].forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!imageModal.hidden) closeModal(imageModal);
      if (!detailsModal.hidden) closeModal(detailsModal);
    }
  });
}
