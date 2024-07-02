const scriptURL = 'https://script.google.com/macros/s/AKfycbxP9h9d84Y9dYDY19Uf8LgurVOVt21WhxxXidc4Y72_GI-VaRX0euul3urljP6MCedVIQ/exec'

const form = document.getElementById('contact_form');
const toastContainer = document.getElementById('toast-container');

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
