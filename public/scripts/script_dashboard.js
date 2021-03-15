const socket = io();
let id = document.getElementById('user').title
let username = document.getElementById('user').innerText

socket.emit("dashboard", {
    id: id
})

/*socket.on('dashboard', async userlist => {
    console.log(userlist)
    for await (user of userlist){
        let item = document.createElement('li')
        item.textContent = user;
        
    
       let item_user = document.getElementById('online_users')
       item_user.appendChild(item);
        }
        

})*/