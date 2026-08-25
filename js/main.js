// Año dinámico en el footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
  const publicPublicationsUrl = 'http://localhost:5000/api/publications/public';
  const catalogArrowLeft = document.getElementById('catalog-arrow-left');
  const catalogArrowRight = document.getElementById('catalog-arrow-right');
  const publicationsPerPage = 15;
  let publicPublications = [];
  let currentPublicationPage = 0;

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const mediaUrl = url => url?.startsWith('http') ? url : `http://localhost:5000${url}`;

  fetch(publicPublicationsUrl)
    .then(response => {
      if (!response.ok) throw new Error('No se pudieron cargar las publicaciones');
      return response.json();
    })
    .then(({ publications }) => {
      publicPublications = publications || [];
      if (!publicPublications.length) {
        publicPublicationsGrid.innerHTML = '<p class="catalog-status">Próximamente encontrarás nuestras publicaciones aquí.</p>';
        return;
      }

      renderPublicationPage();
    })
    .catch(() => {
      publicPublicationsGrid.innerHTML = '<p class="catalog-status">No se pudieron cargar las publicaciones.</p>';
    });

  function renderPublicationPage() {
    const start = currentPublicationPage * publicationsPerPage;
    const pagePublications = publicPublications.slice(start, start + publicationsPerPage);

    publicPublicationsGrid.innerHTML = pagePublications.map(publication => {
      const cover = publication.media?.find(item => item.tipo === 'imagen') || publication.media?.[0];
      const coverUrl = cover ? mediaUrl(cover.url) : '';
      const coverMarkup = cover
        ? cover.tipo === 'video'
          ? `<video controls preload="metadata" aria-label="Video de ${escapeHtml(publication.nombre)}"><source src="${escapeHtml(coverUrl)}"></video>`
          : `<img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(cover.titulo || publication.nombre)}" loading="lazy">`
        : '<span class="media-placeholder">Sin imagen</span>';

      return `
        <article class="public-publication-card reveal" data-publication-name="${escapeHtml(publication.nombre)}" data-publication-description="${escapeHtml(publication.descripcion || 'Consultá por características y disponibilidad.')}">
          <div class="public-publication-media" data-image-area>
            ${coverMarkup}
            ${publication.media?.length > 1 ? `<span class="media-count">${publication.media.length} elementos</span>` : ''}
          </div>
          <div class="public-publication-content" data-details-area tabindex="0" role="button" aria-label="Ver detalle de ${escapeHtml(publication.nombre)}">
            <h3>${escapeHtml(publication.nombre)}</h3>
            <p>${escapeHtml(publication.descripcion || 'Consultá por características y disponibilidad.')}</p>
          </div>
        </article>
      `;
    }).join('');

    publicPublicationsGrid.querySelectorAll('.public-publication-media img').forEach(image => {
      image.addEventListener('click', event => {
        event.stopPropagation();
        openImageModal(image.src, image.alt);
      });
    });

    publicPublicationsGrid.querySelectorAll('[data-details-area]').forEach(details => {
      const openDetails = () => {
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

    const lastPage = Math.ceil(publicPublications.length / publicationsPerPage) - 1;
    catalogArrowLeft.hidden = currentPublicationPage === 0;
    catalogArrowRight.hidden = currentPublicationPage >= lastPage;

    observeReveal(publicPublicationsGrid.querySelectorAll('.reveal'));
  }

  catalogArrowLeft.addEventListener('click', () => {
    if (currentPublicationPage > 0) {
      currentPublicationPage -= 1;
      renderPublicationPage();
    }
  });

  catalogArrowRight.addEventListener('click', () => {
    if ((currentPublicationPage + 1) * publicationsPerPage < publicPublications.length) {
      currentPublicationPage += 1;
      renderPublicationPage();
    }
  });

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
