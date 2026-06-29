const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzR4WD3WIVvTJTzmRNmoKdyv3w4QK9vcdClzbarH7ZdRL9pjrGhf5IyigfPa75-kpFnIA/exec';

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = document.getElementById('contactSubmitBtn');
  const status = document.getElementById('formStatus');
  const formData = new FormData(this);

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.textContent = '';
  status.className = 'form-status';

fetch(SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors',
  body: new URLSearchParams(data)
})
  .then(() => {
    status.textContent = 'Message sent successfully!';
    status.classList.add('success');
    document.getElementById('contactForm').reset();
  })
  .catch(() => {
    status.textContent = 'Something went wrong. Please try again.';
    status.classList.add('error');
  })
  .finally(() => {
    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
});