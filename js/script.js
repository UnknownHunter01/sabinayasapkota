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
