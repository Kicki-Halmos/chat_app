document.addEventListener('DOMContentLoaded', (e) =>{
    //e.preventDefault()
let form = document.getElementById('form');
let input = document.getElementById('input');
let room_name = input.name
let id = document.getElementById('user').title
let username = document.getElementById('user').innerText
let messages = document.getElementById('messages')
let userList = document.getElementById('online_users')
let private_form = document.getElementById('private_form')
let private_input = document.getElementById('private_input')
messages.scrollTop = messages.scrollHeight

console.log(username)
const socket = io();

console.log('web1 ' + socket.id)
socket.emit("dashboard", {
    id: id,
    username: username
})

socket.emit("join room", {
    room_name: room_name,
    id: id
})


form.addEventListener('submit', e => {
    e.preventDefault();

    //console.log('web2 ' + socket.id)
    messages.scrollTop = messages.scrollHeight

    if(input.value) {
        let message = input.value
        socket.emit('chat message', message);
    }

    input.value = '';
})



socket.on('chat message', (message) => {
    console.log(message);
    let item_sender = document.createElement('strong')
    item_sender.setAttribute('class', 'card-title')
    item_sender.textContent = message.username
    console.log(item_sender)
    let item_message = document.createElement('p')
    item_message.setAttribute('class','card-text')
    item_message.textContent = message.text;
    let image = document.createElement('img')
    image.setAttribute("src",'.' + message.profile_pic)
    image.setAttribute("style", "width: 75px; height: 75px; object-fit: cover;")
    image.setAttribute("class", "rounded-circle")
    let messages = document.getElementById('messages')
    let date = document.createElement('p')
    date.setAttribute("class", "card-text")
    let small = document.createElement('small')
    small.setAttribute("class", "text-muted")
    small.textContent = 'Sent ' + message.time
   
    messages.scrollTop = messages.scrollHeight
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

socket.on('userlist', users => {
   // console.log(users)

    /*userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')} `*/
    userList.innerHTML = `
    ${users.map(user => `<li class="nav-item">
    <form action="/dashboard/dm" method="POST">
    <input type="hidden" name="name" value="${user.username}">
    <input type="hidden" name="id" value="${user.id}">
    <input type="hidden" name="socketId" value="${user.socketId}">
    <button type="submit" style="border:none; background:white;" class="nav-link">${user.username}</button>
    </form>
    </li>`).join('')}`
    
    
    
    
    
   // <li title="${user.id}">${user.username}</li>`).join('')}`
})

/*users.map(user => {
    let li = document.createElement('li')
    li.setAttribute('title', user.id)
    li.innerHTML= user.username
    userList.appendChild(li)
})*/


   


/*socket.on("private message", message => {

    console.log(message);
    let item_sender = document.createElement('strong')
    item_sender.setAttribute('class', 'card-title')
    item_sender.textContent = message.username
    console.log(item_sender)
    let item_message = document.createElement('p')
    item_message.setAttribute('class','card-text')
    item_message.textContent = message.text;
    let image = document.createElement('img')
    image.setAttribute("src",'.' + message.profile_pic)
    image.setAttribute("style", "width: 75px", "height: 75px;", "object-fit: cover;")
    image.setAttribute("class", "rounded-circle")
    let messages = document.getElementById('messages')
    let date = document.createElement('span')
    date.setAttribute("style", "color: gray; font-size: small;")
    date.textContent = message.time
   
    messages.scrollTop = messages.scrollHeight
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
    div_cardbody.appendChild(date)
    div_cardbody.appendChild(item_message)

})*/
})



 