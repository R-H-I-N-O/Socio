const socket = io();

const username = user.username;

socket.emit('registerUser', username);

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = document.getElementById("message-input");
    const viewMessage = document.getElementById('view-message');
    socket.emit('privateMessage', { to: 'awwPUcEI2WC4itctAAAD', message, from: username });
    const msgDiv = document.createElement('div');
        msgDiv.textContent = `You: ${message}`;
        viewMessage.appendChild(msgDiv);
        document.getElementById('message-input').value = '';
})