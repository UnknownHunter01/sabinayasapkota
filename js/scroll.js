document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

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
});