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
    console.log(messageInput.value);
    const data ={
        name:nameInput.value,
        message:messageInput.value,
        timestamp:new Date()
    }
    socket.emit('new-message',data)
}
socket.on('chat-message',(data)=>{
    console.log(data);
    
})