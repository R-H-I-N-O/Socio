document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");
    const viewMessage = document.getElementById("view-message");

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the form's default submit behavior
        console.log("Form submission intercepted."); // Debug log

        const message = messageInput.value.trim();

        if (!message) return; // Ignore empty messages

        // Emit the private message to the server
        socket.emit("privateMessage", { to: recipientId, message, from: user._id });

        // Display the message in the sender's chat
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", "sent");
        msgDiv.innerHTML = `
            <span class="message-content">
                ${message}
                <p class="message-timestamp">${new Date().toLocaleString()}</p>
            </span>
        `;
        viewMessage.appendChild(msgDiv);
        viewMessage.scrollTop = viewMessage.scrollHeight; // Auto-scroll to the bottom

        messageInput.value = ""; // Clear the input field
    });
});
