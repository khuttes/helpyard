document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    // -----------------------------------------------------------
    // IMPORTANT: Paste the Web App URL you got from Google Apps Script below
    // Make sure it ends in "/exec"
    // -----------------------------------------------------------
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwekgtasklDi-ZTa2b9UjLSgSlVaPaI6AzW2-_IPvUcQS7KK-N9XvdNYj7vH5QUpKVC/exec';

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if URL is configured correctly
            if (!GOOGLE_SCRIPT_URL || !GOOGLE_SCRIPT_URL.includes('script.google.com')) {
                showStatus("Configuration Error: Please update the Google Script URL in js/contact.js", "error");
                return;
            }

            // Get Form Fields
            const nameInput = form.querySelector('[name="name"]');
            const emailInput = form.querySelector('[name="email"]');
            const messageInput = form.querySelector('[name="message"]');

            // Basic Validation & Sanitization
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                showStatus("Please fill in all the required fields.", "error");
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatus("Please enter a valid email address.", "error");
                return;
            }

            // UI Loading State
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.innerHTML = '<span>Sending... ⏳</span>';
            submitBtn.disabled = true;
            statusMsg.textContent = '';
            statusMsg.className = 'form-status';

            // Efficiently package the data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);

            try {
                // Send Request
                // Using 'no-cors' mode is required for Google Apps Script Web Apps from standard fetches
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                // Since 'no-cors' gives an opaque response, assuming success if no network error thrown
                showStatus("✅ Message sent successfully! I'll get back to you soon.", "success");
                form.reset();

            } catch (error) {
                console.error('Contact Form Error:', error.message);
                showStatus("❌ Error sending message. Please try again later.", "error");
            } finally {
                // Restore button state after a delay
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // Helper function to display status messages
    function showStatus(message, type) {
        statusMsg.textContent = message;
        statusMsg.className = `form-status ${type}`;
        statusMsg.style.color = type === 'error' ? '#f44336' : '#4caf50';
        statusMsg.style.marginTop = '1rem';
        statusMsg.style.padding = '10px';
        statusMsg.style.borderRadius = '5px';
        statusMsg.style.fontWeight = 'bold';
        if (type === 'error') {
            statusMsg.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        } else {
            statusMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        }
    }
});