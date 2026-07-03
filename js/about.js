  const statsRow = document.getElementById('statsRow');
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  if (statsRow) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach(animateCount);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsRow);
  }