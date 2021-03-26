const socket = io();
let id = document.getElementById("user").title;
let username = document.getElementById("user").innerText;
let userList = document.getElementById("online_users");

socket.emit("dashboard", {
  id: id,
  username: username,
});

socket.on("userlist", (users) => {
  userList.innerHTML = `
     ${users
       .map(
         (user) => `<li class="nav-item">
     <form action="/dashboard/dm" method="POST">
     <input type="hidden" name="name" value="${user.username}">
     <input type="hidden" name="id" value="${user.id}">
     <input type="hidden" name="socketId" value="${user.socketId}">
     <button type="submit" style="border:none; background:white;" class="nav-link">🦄 ${user.username}</button>
     </form>
     </li>`
       )
       .join("")}`;
});
