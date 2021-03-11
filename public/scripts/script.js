const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', e => {
    e.preventDefault();

    if(input.value) {
        socket.emit('chat message', input.value);
    }

    input.value = '';
})

socket.on('chat message', message => {
    console.log(message);
    let item = document.createElement('li')
    item.textContent = message;

   let item_message = document.getElementById('messages')
   item_message.appendChild(item);
    
})