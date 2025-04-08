const socket = io();

const clientsTotal = document.getElementById('total-clients');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('/message-tone.mp3');
const pointers = {}; // Track other clients' pointers

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`;
});

// Send mouse movement to the server
document.addEventListener('mousemove', (event) => {
    const mouseData = { x: event.clientX, y: event.clientY };
    socket.emit('mouseMove', mouseData);
});

// Listen for mouse movement updates from other clients
socket.on('mouseMove', (data) => {
    const { id, x, y } = data;

    // If the pointer for this client doesn't exist, create it
    if (!pointers[id]) {
        const pointer = document.createElement('div');
        pointer.classList.add('pointer');
        pointer.id = `pointer-${id}`;
        pointer.style.position = 'absolute';
        pointer.style.width = '10px';
        pointer.style.height = '10px';
        pointer.style.backgroundColor = 'red';
        pointer.style.borderRadius = '50%';
        pointer.style.pointerEvents = 'none'; // Prevent interaction
        document.body.appendChild(pointer);
        pointers[id] = pointer;
    }

    // Update the pointer's position
    pointers[id].style.left = `${x}px`;
    pointers[id].style.top = `${y}px`;
});

// Remove pointer when a client disconnects
socket.on('removePointer', (id) => {
    const pointer = pointers[id];
    if (pointer) {
        pointer.remove();
        delete pointers[id];
    }
});

function sendMessage() {
    if (messageInput.value === '') return;
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        timestamp: new Date(),
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
            ${data.message}
            <span> ${data.name} ⚫ ${moment(data.dateTime).fromNow()}</span>
            </p>
        </li>
        `;
    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    });
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    });
});
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: '',
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `;
    messageContainer.innerHTML += element;
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element);
    });
}