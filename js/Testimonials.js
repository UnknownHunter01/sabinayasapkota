(() => {
  const LOG_PREFIX = "[Testimonials]";
  const warn = (msg) => console.warn(`${LOG_PREFIX} ${msg}`);

  const setupCarousel = () => {
    const carousel = document.querySelector(".testimonials-carousel");
    if (!carousel) return;
    if (carousel.dataset.testimonialsReady === "true") return;

    const track = carousel.querySelector(".testimonials-track");
    const prevBtn = carousel.querySelector(".left-arrow");
    const nextBtn = carousel.querySelector(".right-arrow");
    const dotsWrap = document.querySelector(".testimonials-dots");

    if (!track || !prevBtn || !nextBtn || !dotsWrap) {
      warn("Carousel markup is incomplete. Expected track, arrows, and dots container.");
      return;
    }

    // Collect ORIGINAL slides (before cloning)
    const originalSlides = Array.from(track.querySelectorAll(".testimonial-card"));
    if (originalSlides.length === 0) {
      warn("No testimonial cards found in track.");
      return;
    }

  const getCardsPerView = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 700) return 2;
    return 1;
  };

  // Index meaning:
  // "index" points to the FIRST visible slide within the *track children* (including clones).
  let index = 0;
  let perView = getCardsPerView();
  let clones = perView; // number of clones on each side

  // Auto-scroll config
  const AUTOPLAY_MS = 3500;
  let autoplayTimer = null;
  let isPaused = false;

  // prevent rapid clicks / overlapping transitions
  let isTransitioning = false;

    const gapValue = () => {
      const style = window.getComputedStyle(track);
      const raw = style.columnGap || style.gap || "0";
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const slideWidth = (slide) => {
      const rectW = slide.getBoundingClientRect().width;
      if (rectW > 0) return rectW;
      if (slide.offsetWidth > 0) return slide.offsetWidth;
      const cssW = Number.parseFloat(window.getComputedStyle(slide).width);
      return Number.isFinite(cssW) ? cssW : 0;
    };

    const step = () => {
      const slides = Array.from(track.children);
      const first = slides[0];
      const second = slides[1];
      if (!first) return 0;

      const firstWidth = slideWidth(first);
      if (!second) return Math.round(firstWidth);

      const a = first.getBoundingClientRect();
      const b = second.getBoundingClientRect();
      let distance = Math.round(b.left - a.left); // width + gap

      if (distance <= 0) {
        distance = Math.round(firstWidth + gapValue());
      }

      return Math.max(0, distance);
    };

  const clearClones = () => {
    // Remove everything, re-add originals in order
    track.innerHTML = "";
    originalSlides.forEach((s) => track.appendChild(s));
  };

  const buildClones = () => {
    perView = getCardsPerView();
    clones = Math.min(perView, originalSlides.length); // safety for small counts

    clearClones();

    const slidesNow = Array.from(track.children); // originals only

    if (slidesNow.length <= clones) {
      // Not enough slides to meaningfully clone; still position safely
      index = 0;
      return;
    }

    // Clone last N to the front
    const tail = slidesNow.slice(-clones).map((n) => n.cloneNode(true));
    tail.forEach((n) => {
      n.classList.add("is-clone");
      track.insertBefore(n, track.firstChild);
    });

    // Clone first N to the end
    const head = slidesNow.slice(0, clones).map((n) => n.cloneNode(true));
    head.forEach((n) => {
      n.classList.add("is-clone");
      track.appendChild(n);
    });

    // Start at first ORIGINAL slide (after leading clones)
    index = clones;
  };

  const pageCount = () => {
    // Dots represent pages of ORIGINAL slides
    return Math.max(1, originalSlides.length - perView + 1);
  };

  const activeDotIndex = () => {
    // Map current "index" (track space) back to ORIGINAL page space
    if (originalSlides.length === 0) return 0;
    const i = (index - clones) % originalSlides.length;
    const normalized = (i + originalSlides.length) % originalSlides.length;
    return Math.min(normalized, pageCount() - 1);
  };

  const renderDots = () => {
    dotsWrap.innerHTML = "";
    const pages = pageCount();

    for (let i = 0; i < pages; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Go to testimonial group ${i + 1}`);
      btn.addEventListener("click", () => {
        // Jump to that page in ORIGINAL space => track index = clones + i
        index = clones + i;
        update(true);
        restartAutoplay();
      });
      dotsWrap.appendChild(btn);
    }
  };

  const setDots = () => {
    const d = activeDotIndex();
    Array.from(dotsWrap.children).forEach((btn, i) => {
      btn.setAttribute("aria-current", i === d ? "true" : "false");
    });
  };

    const translateToIndex = (animate = true) => {
      const distance = step();
      if (distance <= 0) return false;
      const x = distance * index;
      if (!animate) track.classList.add("no-anim");
      track.style.transform = `translateX(${-x}px)`;
      if (!animate) {
        // force reflow so the browser applies transform without anim
        track.getBoundingClientRect();
        track.classList.remove("no-anim");
      }
      return true;
    };

    const update = (animate = true) => {
      const moved = translateToIndex(animate);
      if (!moved) {
        isTransitioning = false;
        return false;
      }
      if (animate) isTransitioning = true;
      setDots();
      return true;
    };

  const goNext = () => {
    if (isTransitioning) return;
    index += 1;
    update(true);
  };

  const goPrev = () => {
    if (isTransitioning) return;
    index -= 1;
    update(true);
  };

  // When transition ends, if we are on a clone region, snap to the matching original
  track.addEventListener("transitionend", () => {
    const totalOriginal = originalSlides.length;

    // if no clones were made, just unlock
    if (clones === 0) {
      isTransitioning = false;
      return;
    }

    // Left clone region: index < clones
    if (index < clones) {
      // Snap to the equivalent original near the end
      index = clones + (totalOriginal - 1);
      update(false);
      isTransitioning = false;
      return;
    }

    // Right clone region: index >= clones + totalOriginal
    if (index >= clones + totalOriginal) {
      // Snap back to start original
      index = clones;
      update(false);
      isTransitioning = false;
      return;
    }

    isTransitioning = false;
  });

  // ----- Autoplay (auto scroll) -----
  const stopAutoplay = () => {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = window.setInterval(() => {
      if (isPaused) return;
      goNext();
    }, AUTOPLAY_MS);
  };

  const restartAutoplay = () => {
    startAutoplay();
  };

  // Pause on hover (desktop) + when focused (keyboard users)
  carousel.addEventListener("mouseenter", () => { isPaused = true; });
  carousel.addEventListener("mouseleave", () => { isPaused = false; });

  carousel.addEventListener("focusin", () => { isPaused = true; });
  carousel.addEventListener("focusout", () => { isPaused = false; });

  // Pause when tab is hidden (better UX)
  document.addEventListener("visibilitychange", () => {
    isPaused = document.hidden;
  });

  // Buttons
  prevBtn.addEventListener("click", () => { goPrev(); restartAutoplay(); });
  nextBtn.addEventListener("click", () => { goNext(); restartAutoplay(); });

  // Keyboard support
  carousel.tabIndex = 0;
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { goPrev(); restartAutoplay(); }
    if (e.key === "ArrowRight") { goNext(); restartAutoplay(); }
  });

    let rafRetry = 0;
    const applyWhenReady = () => {
      if (update(false)) return;
      rafRetry += 1;
      if (rafRetry <= 45) {
        window.requestAnimationFrame(applyWhenReady);
      }
    };

    const init = () => {
      isTransitioning = false;
      rafRetry = 0;
      buildClones();
      renderDots();
      applyWhenReady(); // initial position without animation when layout is ready
      startAutoplay();
    };

    window.addEventListener("resize", () => {
      // Rebuild clones for new perView, keep user roughly on same dot/page
      const currentDot = activeDotIndex();
      init();
      index = clones + Math.min(currentDot, pageCount() - 1);
      applyWhenReady();
    });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        applyWhenReady();
      });
      observer.observe(carousel);
    }

    window.addEventListener("load", () => {
      applyWhenReady();
    });

    init();
    carousel.dataset.testimonialsReady = "true";
  };

  const start = () => {
    window.requestAnimationFrame(setupCarousel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
