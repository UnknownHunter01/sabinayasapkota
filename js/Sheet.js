const scriptURL = 'https://script.google.com/macros/s/AKfycbxP9h9d84Y9dYDY19Uf8LgurVOVt21WhxxXidc4Y72_GI-VaRX0euul3urljP6MCedVIQ/exec'

const form = document.forms['contact_form']
form.addEventListener('submit', e=>{
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => alert("Your Message Has Been Submitted Sucessfully."))
    .then(() => { window.location.reload(); })
    .catch(error => console.error('Error:', error.message));
})