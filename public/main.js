const socket =io()

const clientsTotal = document.getElementById('total-clients')

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Total Clients: ${data}`
})