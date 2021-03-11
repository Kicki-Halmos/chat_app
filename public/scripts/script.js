const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name

socket.emit("join room", {
    room_name: room_name
})


form.addEventListener('submit', e => {
    e.preventDefault();


    if(input.value) {
        let message = input.value
        socket.emit('chat message', message);
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
