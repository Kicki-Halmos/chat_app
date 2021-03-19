const socket = io();
let id = document.getElementById('user').title
let username = document.getElementById('user').innerText
let userList = document.getElementById('online_users')

socket.emit("dashboard", {
    id: id,
    username:username
})

socket.on('userlist', async users => {
   // console.log(users)
    userList.innerHTML = `
    ${users.map(user => `<li class="user" >${user.username}</li>`).join('')}

    `
})