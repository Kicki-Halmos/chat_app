document.addEventListener('DOMContentLoaded', (e) =>{
    //e.preventDefault()
const socket = io();

let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name
let id = document.getElementById('user').title
let username = document.getElementById('user').innerText
let messages = document.getElementById('messages')
messages.scrollIntoView({behavior: "smooth"});
//console.log(username)
//let input_username = username.id_ref
//console.log(input_username)
console.log(room_name)

socket.emit("dashboard", {
    id: id
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

socket.on('chat message', (message, sender, profile_pic) => {
    console.log(message);
    let item_sender = document.createElement('strong')
    item_sender.setAttribute('class', 'card-title')
    item_sender.textContent = sender
    let item_message = document.createElement('p')
    item_message.setAttribute('class','card-text')
    item_message.textContent = message;
    let image = document.createElement('img')
    image.setAttribute("src",'.' + profile_pic)
    image.setAttribute("style", "width: 75px", "height: 75px;", "object-fit: cover;")
    image.setAttribute("class", "rounded-circle")
    let messages = document.getElementById('messages')
    messages.scrollIntoView(false)
    let div_card = document.createElement('div')
    div_card.setAttribute('class', "card mb-3 border-0 shadow-sm")
    div_card.setAttribute('style', "max-width: 540px;")
    let div_row = document.createElement('div')
    div_row.setAttribute('class', "row g-0")
    let div_col2 = document.createElement('div')
    div_col2.setAttribute('class', 'col-2')
    let div_col10 = document.createElement('div')
    div_col10.setAttribute('class', 'col-10')
    let div_cardbody = document.createElement('div')
    div_cardbody.setAttribute('class', 'card-body')

    messages.appendChild(div_card)
    div_card.appendChild(div_row)
    div_row.appendChild(div_col2)
    div_row.appendChild(div_col10)
    div_col2.appendChild(image)
    div_col10.appendChild(div_cardbody)
    div_cardbody.appendChild(item_sender)
    div_cardbody.appendChild(item_message)

 
    
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



   
})

 