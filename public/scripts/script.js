document.addEventListener('DOMContentLoaded', (e) =>{
    //e.preventDefault()
const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name
let username = document.getElementById('user').innerText
let input_username = username.name
//console.log(input.name)
console.log(username)
//console.log(input)

/*socket.emit("dashboard", {
    name: username
})*/

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

/*const loadUser = () => {
    for(user of userlist.user){
    let item = document.createElement('li')
    item.textContent = user;
    console.log(item)

   let item_user = document.getElementById('online_users')
   item_user.appendChild(item);
    }
    console.log(users)
}

loadUser()*/

   
})

 /*fetch(`/dashboard/${room_name}`)
        .then(res => res.json())
           
        .then(users => {
            for(user of users) {
            let item = document.createElement('li')
            item.textContent = user.name;
            let item_user = document.getElementById('online_users')
            item_user.appendChild(item);
            
            }
        })*/