const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const submitBtn = document.getElementById("contactSubmitBtn");

const scriptURL = "https://script.google.com/macros/s/AKfycbx95WDVm4wwUnG6A7_DKhAdAjVt6D-axNXOyNS41yyf1EMcFYQZ2QOn_HBsPKLqdAVX/exec";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const formData = {
        Name: form.Name.value,
        Email: form.Email.value,
        Subject: form.Subject.value,
        Message: form.Message.value
    };

    try {
        const response = await fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.result === "success") {
            status.innerHTML = "✅ Message sent successfully!";
            form.reset();
        } else {
            status.innerHTML = "❌ Something went wrong.";
        }
    } catch (err) {
        status.innerHTML = "❌ Failed to send message.";
        console.error(err);
    }

    submitBtn.disabled = false;
    submitBtn.innerText = "Send Message";
});
