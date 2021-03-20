document.addEventListener('DOMContentLoaded', (e) =>{
    //e.preventDefault()
//let form = document.getElementById('form');
//let input = document.getElementById('input');

let id = document.getElementById('user').title
let username = document.getElementById('user').innerText
let messages = document.getElementById('messages_private')
let userList = document.getElementById('online_users')
let private_form = document.getElementById('private_form')
let private_input = document.getElementById('private_input')
let room_name = private_input.name
messages.scrollTop = messages.scrollHeight
console.log(username)

const socket = io();

//console.log('web1 ' + socket.id)
socket.emit("dashboard", {
    id: id,
    username: username
})


socket.on('userlist', users => {
    console.log(users)

    /*userList.innerHTML = `
    ${users.map(user => `<li title="${user.socketId}">${user.username}</li>`).join('')}`*/
    userList.innerHTML = `
    ${users.map(user => `<li class="nav-item">
    <form action="/dashboard/dm" method="POST">
    <input type="hidden" name="name" value="${user.username}">
    <input type="hidden" name="id" value="${user.id}">
    <input type="hidden" name="socketId" value="${user.socketId}">
    <button type="submit" class="nav-link">${user.username}</button>
    </form>
    </li>`).join('')}`
    
})

userList.addEventListener('click', e => {
    console.log(e.target)
})

private_form.addEventListener('submit', e => {
    e.preventDefault();
    if(private_input.value) {
        let message = private_input.value
        socket.emit('private chat', {
            message: message, 
            socketId: socket.id, 
            username: username,
            id: id,
            room_name: room_name,
        });
    }

    private_input.value = '';
    

    


})
   


socket.on("private message", message => {

    console.log('hallå' + message);
    let item_sender = document.createElement('strong')
    item_sender.setAttribute('class', 'card-title')
    item_sender.textContent = message.username
    console.log(item_sender)
    let item_message = document.createElement('p')
    item_message.setAttribute('class','card-text')
    item_message.textContent = message.text;
    let image = document.createElement('img')
    image.setAttribute("src", `../.${message.profile_pic}`)
    image.setAttribute("style", "width: 75px; height: 75px; object-fit: cover;")
    image.setAttribute("class", "rounded-circle")
    let messages = document.getElementById('messages_private')
    let date = document.createElement('p')
    date.setAttribute("class", "card-text")
    let small = document.createElement('small')
    small.setAttribute("class", "text-muted")
    small.textContent = 'Sent ' + message.time
   
    //messages.scrollTop = messages.scrollHeight
    let div_card = document.createElement('div')
    div_card.setAttribute('class', "card mb-3 border-0 shadow-sm")
    //div_card.setAttribute('style', "max-width: 540px;")
    let div_row = document.createElement('div')
    div_row.setAttribute('class', "row g-0")
    let div_col2 = document.createElement('div')
    div_col2.setAttribute('class', 'col-2')
    let div_col10 = document.createElement('div')
    div_col10.setAttribute('class', 'col-10')
    let div_cardbody = document.createElement('div')
    div_cardbody.setAttribute('class', 'card-body')
    let br = document.createElement('br')

    messages.appendChild(div_card)
    div_card.appendChild(div_row)
    div_row.appendChild(div_col2)
    div_row.appendChild(div_col10)
    div_col2.appendChild(image)
    div_col10.appendChild(div_cardbody)
    div_cardbody.appendChild(item_sender)
    div_cardbody.appendChild(item_message)
    div_cardbody.appendChild(date)
    date.appendChild(small)

})
})



 