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
});

window.onload = function() {
    if (!window.location.hash) {
        window.location.hash = "#section1";
    }
};
