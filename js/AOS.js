    AOS.init({
        offset: 200,  // Offset (in px) from the original trigger point
        duration: 1000,  // Duration of the animation
        easing: 'ease-in-out',  // Easing function
        delay: 100,  // Delay before the animation starts
        once: false  // Animation will repeat every time you scroll up and down
    });

    const slider = document.querySelector('.slider');
let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
});

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}




// Create the full-screen overlay element
const overlay = document.createElement('div');
overlay.classList.add('fullscreen-overlay');
document.body.appendChild(overlay);

// Add an image element to the overlay
const overlayImage = document.createElement('img');
overlay.appendChild(overlayImage);

// Function to open the image in full screen
function openFullScreen(src) {
    overlayImage.src = src;
    overlay.style.display = 'flex';
}

// Add event listeners to each certificate image
document.querySelectorAll('.certificate-item img').forEach(img => {
    img.addEventListener('click', () => openFullScreen(img.src));
});

// Close the overlay when clicked
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
});
