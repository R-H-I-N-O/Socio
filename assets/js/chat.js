const socket = io();
console.log(user.username, "username");
const username = user.username;

socket.emit("registerUser", username); // Register user on the server with socket ID

const chatForm = document.getElementById("chat-form");
const viewMessage = document.getElementById("view-message");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  console.log("Sending message:", message);

  socket.emit("privateMessage", { to: recipientId, message, from: user._id });

  const msgDiv = document.createElement("div");
  msgDiv.textContent = `You: ${message}`;
  viewMessage.appendChild(msgDiv);
  viewMessage.offsetHeight;
  viewMessage.scrollTop = viewMessage.scrollHeight;

  messageInput.value = "";
  location.reload();
});

// Listen for incoming private messages from the server
socket.on("privateMessage", (data) => {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${data.from}: ${data.message}`;
  viewMessage.appendChild(msgDiv);
  viewMessage.offsetHeight;
  viewMessage.scrollTop = viewMessage.scrollHeight;
  location.reload();

});
