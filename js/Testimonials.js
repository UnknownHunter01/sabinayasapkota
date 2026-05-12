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
  const MAX_STEP_RETRIES = 45;
  let pendingStepFrame = 0;
  let stepRetryCount = 0;

    const gapValue = () => {
      const style = window.getComputedStyle(track);
      const raw = style.gap || style.columnGap || "0";
      const parsed = parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const step = () => {
      const slides = Array.from(track.children);
      const first = slides[0];
      if (!first) return 0;

      const firstRect = first.getBoundingClientRect();
      const width =
        first.offsetWidth
        || firstRect.width
        || parseFloat(window.getComputedStyle(first).width)
        || 0;
      const distance = width + gapValue();
      if (!Number.isFinite(distance) || distance <= 0) return 0;
      return distance;
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

  const activeSlideIndex = () => {
    // Map current "index" (track space) back to ORIGINAL page space
    if (originalSlides.length === 0) return 0;
    const i = (index - clones) % originalSlides.length;
    return (i + originalSlides.length) % originalSlides.length;
  };

  const activeDotIndex = () => {
    return Math.min(activeSlideIndex(), pageCount() - 1);
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
      if (!Number.isFinite(distance) || distance <= 0) {
        if (!pendingStepFrame && stepRetryCount < MAX_STEP_RETRIES) {
          stepRetryCount += 1;
          pendingStepFrame = window.requestAnimationFrame(() => {
            pendingStepFrame = 0;
            update(false);
          });
        }
        return false;
      }
      stepRetryCount = 0;
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

  const moveBy = (delta) => {
    if (isTransitioning) return;
    const previous = index;
    index += delta;
    if (!update(true)) {
      // `update` returns false only when `translateToIndex` cannot get a valid step yet.
      // In that case, `translateToIndex` already scheduled a requestAnimationFrame retry for update(false).
      // Restore logical position so next/prev clicks remain consistent until layout is ready.
      index = previous;
    }
  };

  const goNext = () => {
    moveBy(1);
  };

  const goPrev = () => {
    moveBy(-1);
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

    // 45 frames equals 750ms at 60fps, enough for delayed layout/images to settle.
    const MAX_LAYOUT_RETRIES = 45;
    let layoutRetryCount = 0;
    const applyWhenReady = () => {
      if (update(false)) return;
      layoutRetryCount += 1;
      if (layoutRetryCount <= MAX_LAYOUT_RETRIES) {
        window.requestAnimationFrame(applyWhenReady);
      }
    };

    const init = () => {
      isTransitioning = false;
      layoutRetryCount = 0;
      stepRetryCount = 0;
      buildClones();
      renderDots();
      window.requestAnimationFrame(applyWhenReady); // wait a frame for clone layout
      startAutoplay();
    };

    window.addEventListener("resize", () => {
      // Rebuild clones for new perView, keep user roughly on same dot/page
      const currentSlide = activeSlideIndex();
      init();
      index = clones + Math.min(currentSlide, pageCount() - 1);
      applyWhenReady();
    });

    if ("ResizeObserver" in window) {
      let resizeObserverFrameId = 0;
      const observer = new ResizeObserver(() => {
        if (resizeObserverFrameId) return;
        resizeObserverFrameId = window.requestAnimationFrame(() => {
          resizeObserverFrameId = 0;
          applyWhenReady();
        });
      });
      observer.observe(carousel);
      // Keep cleanup next to observer setup so this closure can safely reference `observer`.
      window.addEventListener("pagehide", () => {
        if (resizeObserverFrameId) window.cancelAnimationFrame(resizeObserverFrameId);
        if (pendingStepFrame) window.cancelAnimationFrame(pendingStepFrame);
        observer.disconnect();
      }, { once: true });
    }

    window.addEventListener("load", () => {
      applyWhenReady();
    }, { once: true });

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
