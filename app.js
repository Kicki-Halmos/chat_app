const express = require("express");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const fileUpload = require('express-fileupload')
const fs = require('fs')
const User = require("./models/user");
const Room = require("./models/room");
require("./config/passport")(passport);


//db
mongoose
  .connect("mongodb://localhost:27017/slack")
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

//views
app.set("views", path.join(__dirname, "views"));
app.set("view enginge", "ejs");

//path
app.use("/public", express.static(path.join(__dirname, "public")));

//fileupload
app.use(fileUpload({
  createParentPath: true
}))

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
  socket.on("dashboard", async (data) => {
    //console.log(data.id);
    
    await User.findByIdAndUpdate(
      data.id,
      { loggedin: true },
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          //console.log('this is the result: ' + result)
        }
      }
    );
  });

  
  socket.on("join room", async (data) => {
    const room_name = await data.room_name;
    const name = await data.name;
    const user = await User.findById(data.id).exec();
    await socket.join(room_name);

    await socket.on("chat message",  (message) => {
     
      
      const user_message = message
      
      Room.findOneAndUpdate({name: room_name}, {$push: {messages: [{ message_sender: user._id, message:user_message}]}}, {useFindAndModify: false}, (error, result) => {
        if(error){
          console.log(error)
        }
        //console.log(result)
        const sender = user.name
        const profile_pic = user.profile_pic
        io.to(room_name).emit("chat message",message, sender, profile_pic);
       
      } )

 
  });

 
    
 
  });

  socket.on("disconnect", async (data) => {
    await User.findByIdAndUpdate(
      data.id,
      { loggedin: false },
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          //console.log(result)
        }
      }
    );
  });
});

server.listen(3000);
