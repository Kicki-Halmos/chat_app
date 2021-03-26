const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const User = require("./models/user");
const Room = require("./models/room");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave } = require("./utils/users");
const PrivateChat = require("./models/private_chat");
require("./config/passport")(passport);

//db
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect("mongodb://localhost:27017/slack")
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

//views
app.set("views", path.join(__dirname, "views"));
app.set("view enginge", "ejs");

//static folder
app.use("/public", express.static(path.join(__dirname, "public")));

//fileupload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//bodyparser
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());
app.use((request, response, next) => {
  response.locals.success_msg = request.flash("success_msg");
  response.locals.error_msg = request.flash("error_msg");
  response.locals.error = request.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//socket
io.on("connection", (socket) => { 
  

  socket.on("dashboard", (data) => {
    
    const users = userJoin(socket.id, data.id, data.username);
    
    socket.join("dashboard");
    io.to("dashboard").emit("userlist", users);
  });

  socket.on('private room', async (data)=>{ 
    
    const room_name = await data.room_name;
    const name = await data.name;

    const user = await User.findById(data.id).exec();
    await socket.join(room_name);
    await socket.on('private chat', (message) => {
      const user_message = message.message;
      const sender = user.name;
      const profile_pic = user.profile_pic;
      const user_data = formatMessage(user_message, sender, profile_pic);
      
     PrivateChat.findOneAndUpdate({name: room_name}, {$push: {messages: [{date: user_data.time, message_sender: user._id, message:user_message}]}}, {useFindAndModify: false}, (error, result) => {
        if(error){
          console.log(error)
        }
    
     io.to(room_name).emit("private chat", (user_data))
      })
    })
 
})

  socket.on("join room", async (data) => {
    console.log('channel connected')
    const room_name = await data.room_name;
    const name = await data.name;

    const user = await User.findById(data.id).exec();
    await socket.join(room_name);

    await socket.on("chat message", (message) => {
      const user_message = message;
      const sender = user.name;
      const profile_pic = user.profile_pic;
      const user_data = formatMessage(message, sender, profile_pic);

      Room.findOneAndUpdate(
        { name: room_name },
        {
          $push: {
            messages: [
              {
                date: user_data.time,
                message_sender: user._id,
                message: user_message,
              },
            ],
          },
        },
        { useFindAndModify: false },
        (error, result) => {
          if (error) {
            console.log(error);
          }
          console.log('room' + result)

          io.to(room_name).emit("chat message", user_data);
        }
      );
    });
  });

  socket.on("disconnect", () => {
    const users = userLeave(socket.id);

    if (users) {
      io.to("dashboard").emit("userlist", users);
    }
  });
});

server.listen(3000);
