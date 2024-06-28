<<<<<<< HEAD
=======
window.onload = function() {
    // Check if the URL contains the query parameter `redirected=true`
    const urlParams = new URLSearchParams(window.location.search);
    const redirected = urlParams.get('redirected');

    if (redirected) {
        // Remove the query parameter
        const newUrl = window.location.origin + window.location.pathname + '#home';
        window.history.replaceState({}, '', newUrl);

        // Scroll to the home section
        document.getElementById('home').scrollIntoView();
    }
};
>>>>>>> 5fb3d46e98df3dac4c7c2fc1b648372e8adccd2c
