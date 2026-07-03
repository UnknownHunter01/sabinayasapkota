const scriptURL = "https://script.google.com/macros/s/AKfycbx95WDVm4wwUnG6A7_DKhAdAjVt6D-axNXOyNS41yyf1EMcFYQZ2QOn_HBsPKLqdAVX/exec";

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("contactSubmitBtn");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "Sending your message...";
    status.style.color = "#666";

    try {
        const response = await fetch(scriptURL, {
            method: "POST",
            body: new FormData(form)
        });

        const data = await response.json();

        if (data.result === "success") {
            status.textContent = "✅ Message sent successfully!";
            status.style.color = "#22c55e";

            submitBtn.textContent = "Sent ✓";
            form.reset();
        } else {
            throw new Error(data.error || "Unknown error");
        }

    } catch (error) {
        console.error(error);

        status.textContent = "❌ Failed to send message. Please try again.";
        status.style.color = "#ef4444";

        submitBtn.textContent = "Try Again";
    }

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        status.textContent = "";
    }, 2000);
});