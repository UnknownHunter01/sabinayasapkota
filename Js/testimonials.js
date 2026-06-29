  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const originalSlides = Array.from(track.children);
  const totalOriginal = originalSlides.length;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  let slidesPerView = getSlidesPerView();
  let currentIndex = slidesPerView;
  let autoScrollInterval;
  let isTransitioning = false;

  function cloneSlides() {
    track.innerHTML = '';

    const headClones = originalSlides.slice(-slidesPerView).map(s => s.cloneNode(true));
    const tailClones = originalSlides.slice(0, slidesPerView).map(s => s.cloneNode(true));

    [...headClones, ...originalSlides.map(s => s.cloneNode(true)), ...tailClones].forEach(slide => {
      track.appendChild(slide);
    });

    currentIndex = slidesPerView;
    setPosition(false);
  }

  function setPosition(animate = true) {
    const slideWidth = 100 / slidesPerView;
    track.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  }

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    setPosition(true);
    updateDots();
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (currentIndex >= totalOriginal + slidesPerView) {
      currentIndex = slidesPerView;
      setPosition(false);
    }
    if (currentIndex < slidesPerView) {
      currentIndex = totalOriginal + slidesPerView - 1;
      setPosition(false);
    }
  });

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalOriginal; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.addEventListener('click', () => {
        currentIndex = i + slidesPerView;
        setPosition(true);
        updateDots();
        restartAutoScroll();
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const realIndex = (currentIndex - slidesPerView + totalOriginal) % totalOriginal;
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === realIndex);
    });
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 4000);
  }

  function restartAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    cloneSlides();
    buildDots();
  });

  cloneSlides();
  buildDots();
  startAutoScroll();
