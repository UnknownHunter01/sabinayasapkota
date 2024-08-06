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



// Get the modal
var modal = document.getElementById('modal');

// Get the image and insert it inside the modal
var modalImg = document.getElementById("modal-img");

document.querySelectorAll('.cert-img').forEach(item => {
    item.addEventListener('click', event => {
        modal.style.display = "block";
        modalImg.src = event.target.src;
    });
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}

// Close modal when clicking outside of the image
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
