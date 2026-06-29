const scriptURL = "YOUR_WEB_APP_URL";

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("contactSubmitBtn");
const status = document.getElementById("formStatus");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "";

    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form)
    })
    .then(res => res.json())
    .then(data => {
        if (data.result === "success") {
            status.textContent = "✅ Message sent successfully!";
            status.style.color = "#22c55e";
            form.reset();
        } else {
            status.textContent = "❌ Something went wrong.";
            status.style.color = "#ef4444";
        }
    })
    .catch(err => {
        console.error(err);
        status.textContent = "❌ Failed to send message.";
        status.style.color = "#ef4444";
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    });
});