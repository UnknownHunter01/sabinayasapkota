  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certItems = document.querySelectorAll('.cert-item');
  let certCurrentIndex = 0;
  let certVisibleItems = Array.from(certItems);

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      certItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('cert-hidden');
        } else {
          item.classList.add('cert-hidden');
        }
      });

      certVisibleItems = Array.from(certItems).filter(i => !i.classList.contains('cert-hidden'));
    });
  });

  const certLightbox = document.getElementById('certLightbox');
  const certLightboxImg = document.getElementById('certLightboxImg');
  const certLightboxTitle = document.getElementById('certLightboxTitle');
  const certLightboxDesc = document.getElementById('certLightboxDesc');
  const certLightboxDate = document.getElementById('certLightboxDate');
  const certLightboxVerify = document.getElementById('certLightboxVerify');
  const certLightboxClose = document.getElementById('certLightboxClose');
  const certLightboxPrev = document.getElementById('certLightboxPrev');
  const certLightboxNext = document.getElementById('certLightboxNext');
  const certZoomHint = document.getElementById('certZoomHint');

  let isZoomed = false;

  function resetZoom() {
    certLightboxImg.classList.remove('cert-zoomed');
    certZoomHint.innerHTML = '<i class="bi bi-zoom-in"></i>';
    isZoomed = false;
  }

  certLightboxImg.addEventListener('click', (e) => {
    if (!isZoomed) {
      const rect = certLightboxImg.getBoundingClientRect();
      const originX = ((e.clientX - rect.left) / rect.width) * 100;
      const originY = ((e.clientY - rect.top) / rect.height) * 100;
      certLightboxImg.style.transformOrigin = `${originX}% ${originY}%`;
      certLightboxImg.classList.add('cert-zoomed');
      certZoomHint.innerHTML = '<i class="bi bi-zoom-out"></i>';
      isZoomed = true;
    } else {
      resetZoom();
    }
  });

  function openCertLightbox(item) {
    certCurrentIndex = certVisibleItems.indexOf(item);
    showCertItem(certVisibleItems[certCurrentIndex]);
    certLightbox.classList.add('cert-active');
  }

  function showCertItem(item) {
    resetZoom();
    const img = item.querySelector('img');
    certLightboxImg.src = img.src;
    certLightboxImg.alt = img.alt;
    certLightboxTitle.textContent = item.getAttribute('data-title') || '';
    certLightboxDesc.textContent = item.getAttribute('data-desc') || '';
    certLightboxDate.textContent = item.getAttribute('data-date') || '';

    const verifyUrl = item.getAttribute('data-verify');
    if (verifyUrl) {
      certLightboxVerify.href = verifyUrl;
      certLightboxVerify.classList.remove('cert-verify-hidden');
    } else {
      certLightboxVerify.classList.add('cert-verify-hidden');
    }
  }

  certItems.forEach(item => {
    item.addEventListener('click', () => openCertLightbox(item));
  });

  certLightboxClose.addEventListener('click', () => {
    certLightbox.classList.remove('cert-active');
    resetZoom();
  });

  certLightbox.addEventListener('click', (e) => {
    if (e.target === certLightbox) {
      certLightbox.classList.remove('cert-active');
      resetZoom();
    }
  });

  certLightboxPrev.addEventListener('click', () => {
    certCurrentIndex = (certCurrentIndex - 1 + certVisibleItems.length) % certVisibleItems.length;
    showCertItem(certVisibleItems[certCurrentIndex]);
  });

  certLightboxNext.addEventListener('click', () => {
    certCurrentIndex = (certCurrentIndex + 1) % certVisibleItems.length;
    showCertItem(certVisibleItems[certCurrentIndex]);
  });

  document.querySelectorAll('.cert-protected-img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart', e => e.preventDefault());
  });