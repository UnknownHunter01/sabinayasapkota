document.addEventListener("DOMContentLoaded", () => {
    // Scroll to section if URL contains hash
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            window.setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to ensure smooth scrolling after load
        }
    }

    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const toastContainer = document.getElementById('toast-container');
    const form = document.getElementById('contact_form');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxP9h9d84Y9dYDY19Uf8LgurVOVt21WhxxXidc4Y72_GI-VaRX0euul3urljP6MCedVIQ/exec';

    // Smooth scroll to section on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Highlight nav link on scroll
    window.onscroll = () => {
        let top = window.scrollY;

        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    let activeLink = document.querySelector('header nav a[href*=' + id + ']');
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                });
            }
        });
    };

    // Toggle menu icon and navbar
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    // ===== Scroll Reveal ("Scrollibity") =====
    // Mirrors Mostudio's contentWayPoint(): when a group's container enters the
    // viewport, every item inside cascades in one after another (50ms apart),
    // rather than each item fading in independently. This removes data-aos from
    // these grids so the cascade timing isn't fighting with AOS's own animation.
    // .testimonial-card is excluded: the carousel script clones those nodes for
    // its infinite-loop effect, and clones never get observed/revealed.
    const revealGroupSelectors = [
        '.skills-grid',
        '.certificates-grid',
        '.timeline-items',
        '.services-grid',
        '.portfolio-grid'
    ];

    const revealGroups = document.querySelectorAll(revealGroupSelectors.join(', '));

    revealGroups.forEach(group => {
        const items = Array.from(group.children);
        items.forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
            el.removeAttribute('data-aos-easing');
            el.classList.add('reveal');
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = Array.from(entry.target.children);
                items.forEach((el, k) => {
                    setTimeout(() => {
                        el.classList.add('reveal-visible');
                    }, k * 50);
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealGroups.forEach(group => revealObserver.observe(group));

    // ===== Portfolio Filter =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });

    // ===== Portfolio Lightbox =====
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.preview-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.portfolio-card');
            const img = card ? card.querySelector('img') : null;
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
            }
            // If this card is still a placeholder (no real image yet), do nothing.
        });
    });

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Form submission handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            // Show a success message with a stylish toast notification
            showToast('success', 'Your message has been submitted successfully.');

            // Optional: Reset form fields after successful submission
            form.reset();

        } catch (error) {
            console.error('Error:', error.message);
            // Display an error message with a stylish toast notification
            showToast('error', 'There was an error submitting your message. Please try again later.');
        }
    });

    // Toast notification function
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Automatically remove the toast after a few seconds
        setTimeout(() => {
            toast.style.opacity = '1';
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    toast.remove();
                }, 300); // Remove toast after fade out animation (300ms)
            }, 5000); // Show toast for 5 seconds
        }, 100); // Delay before showing toast (100ms)
    }

    // Intersection observer for section visibility and updating URL hash
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: "0px",
        threshold: 0.5 // trigger when 50% of the section is in view
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Automatically set hash to #section1 if none exists on page load
    if (!window.location.hash) {
        window.location.hash = "#section1";
    }
});
