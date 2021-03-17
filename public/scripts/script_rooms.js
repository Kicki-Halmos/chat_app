document.addEventListener('DOMContentLoaded', (e) =>{
   
const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name
let id = document.getElementById('user').title
//let private_id = CMzdMluZIQ0orLKnAAAL
//let username = document.getElementById('user').innerText



/*socket.emit("dashboard", {
    id: id
})*/
socket.on("connect", () => {
    console.log('id_client ' + socket.id)
})
socket.emit('private chat', {
    anotherSocketId: socket.id
})

socket.emit("join room", {
    room_name: room_name,
    id: id
})


form.addEventListener('submit', e => {
    e.preventDefault();


    if(input.value) {
        let message = input.value
        socket.emit('chat message', message);
    }

    input.value = '';
})

socket.on('chat message', (message, sender) => {
    //console.log(message);
    let item_sender = document.createElement('strong')
    item_sender.textContent = sender
    let item_message = document.createElement('p')
    item_message.textContent = message;

   let message_thread = document.getElementById('messages')
   message_thread.appendChild(item_sender)
   message_thread.appendChild(item_message)
    
})

/*socket.on('dashboard', async userlist => {
    console.log(userlist)
    for await (user of userlist){
        let item = document.createElement('li')
        item.textContent = user;
        
        
       let item_user = document.getElementById('online_users')
       item_user.appendChild(item);
        }
       
        userlist = [];
})*/
    socket.on('private chat', socket.id, message => {
        let item_sender = document.createElement('strong')
        item_sender.textContent = sender
        let item_message = document.createElement('p')
        item_message.textContent = message;
    
       let message_thread = document.getElementById('messages')
       message_thread.appendChild(item_sender)
       message_thread.appendChild(item_message)
    } )

})
   


 