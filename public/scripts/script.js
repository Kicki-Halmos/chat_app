document.addEventListener('DOMContentLoaded', (e) =>{
    //e.preventDefault()
const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name
let id = document.getElementById('user').title
let username = document.getElementById('user').innerText
//console.log(username)
//let input_username = username.id_ref
//console.log(input_username)
console.log(room_name)

socket.emit("dashboard", {
    id: id
})

socket.emit("join room", {
    room_name: room_name,
    name: username
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

socket.on('dashboard', async userlist => {
    console.log(userlist)
    for await (user of userlist){
        let item = document.createElement('li')
        item.textContent = user;
        
        
       let item_user = document.getElementById('online_users')
       item_user.appendChild(item);
        }
       

})



   
})

 