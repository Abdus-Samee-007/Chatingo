const socket =io()

const clientsTotal = document.getElementById('total-clients')
const messageContainer=document.getElementById('message-container')
const nameInput=document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage(){
    if(!messageInput.value === '') return;
    console.log(messageInput.value);
    const data ={
        name:nameInput.value,
        message:messageInput.value,
        timestamp:new Date()
    }
    socket.emit('new-message',data)
    addMessageToUI(true,data)
    messageInput.value =''
}
socket.on('chat-message',(data)=>{
    // console.log(data);
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage, data){
    const element =` <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
            ${data.message}
                Lorem, ipsum.
                <span> ${data.message} 🔴 ${moment(data.dateTime).fromNow()}/span>
            </p>
        </li>
        `
    messageContainer.innerHTML+=element
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}