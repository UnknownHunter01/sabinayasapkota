document.addEventListener('DOMContentLoaded', function() {
    const feedbackTrack = document.querySelector('.feedback-track');
    const feedbackCards = document.querySelectorAll('.feedback-card');

    function setAnimationDuration() {
        let cardWidth = feedbackCards[0].offsetWidth + 20; // card width + margin
        let totalWidth = cardWidth * feedbackCards.length / 2; // half of the total cards for seamless looping
        feedbackTrack.style.animationDuration = `${totalWidth / 50}s`; // Adjust the speed as necessary
    }

    setAnimationDuration();
    window.addEventListener('resize', setAnimationDuration);
});
