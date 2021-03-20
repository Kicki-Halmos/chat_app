const express = require("express");
const app = express();
const fs = require("fs");

const { ensureAuthenticated } = require("../config/auth");
const Room = require("../models/room");
const User = require("../models/user");
const PrivateChat = require("../models/private_chat");
const router = express.Router();

//dashboard
router.get("/", ensureAuthenticated, async (req, res) => {
  //let userlist = [];
  let file_path = ""
  let channels = [];
  let dm = [];

  await User.findById(req.user.id, (error,user) => {
    if(error) {
      console.log(error)
    }
    else{
      file_path = user.profile_pic
    }
  })

 
  await PrivateChat.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
       let membersArray = item.members
       //console.log(membersArray)
       if(membersArray.includes(req.user.id)){
        dm.push(item.name);
      }
    }
    }
  });

  await Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) channels.push(item.name);
    } 
    res.render("dashboard.ejs", {
      user: req.user,
      channels: channels,
      dm: dm,
      profile_pic: file_path,
    });
  });
  
});

//create new channel
router.post("/", (req, res) => {
  //console.log(req.body);
  const room = new Room({
    name: req.body.channelname,
  });

  room
    .save()
    .then((value) => {})
    .catch((error) => console.log(error));

  res.redirect("/dashboard");
});

//join channel
router.get("/:name", ensureAuthenticated, async (req, res) => {
  let dm = [];
  let db_messages = [];
  let channels = [];
  let room_name = req.params.name;
  let file_path =""

  await PrivateChat.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
       let membersArray = item.members
       //console.log(membersArray)
       if(membersArray.includes(req.user.id)){
        dm.push(item.name);
      }
    }
    }
  });

  await User.findById(req.user.id, (error,user) => {
    if(error) {
      console.log(error)
    }
    else{
      file_path += '.' + user.profile_pic
    }
  })

 await  Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        channels.push(item.name);
      }
    }
  });

  Room.findOne({ name: room_name })
    .populate({
      path: "messages",
      populate: { path: "message_sender", model: "User" },
    })
    .exec(function (error, result) {
      if (error) {
        return HandleError(error);
      } else {
        //console.log(result.messages);

        for (item of result.messages) {
          
          let message = {
            _id: item._id,
            message_sender: item.message_sender.name,
            message: item.message,
            file_path: '.' + item.message_sender.profile_pic,
            date: item.date
          };
          
            db_messages.push(message);
          };
        
          res.render("rooms.ejs", {
            channelname: room_name,
            user: req.user,
            channels: channels,
            dm:dm,
            messages: db_messages,
            profile_pic: file_path,
          });
      }
    });
});

//create new dm -  channel
router.post("/dm", async (req, res) => {
  room_name = req.user.name + "-" + req.body.name
  console.log(room_name)

  let private_chat = await PrivateChat.find({$and: [{members: req.user.id}, {members: req.body.id}]}, (error, result) => {
    if(error){
      console.log(error)
    }
    else {
      console.log(result)
    }
  })

  console.log(private_chat)

  if(private_chat.length > 0) { 
    res.redirect(`/dashboard/dm/${private_chat[0].name}`)
  }
    else {
      privateChat = new PrivateChat({
        name: room_name,
        members: [req.user.id, req.body.id]
      });
    
      privateChat
        .save()
        .then((value) => {})
        .catch((error) => console.log(error));
        res.redirect(`/dashboard/dm/${room_name}`)
    }
    
  
  
});

//join dm - channel
router.get("/dm/:name", ensureAuthenticated,  async (req, res) => { 
  let dm = [];
  let db_messages = [];
  let channels = [];
  let room_name = req.params.name;
  let file_path =""

  await PrivateChat.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
       let membersArray = item.members
       //console.log(membersArray)
       if(membersArray.includes(req.user.id)){
        dm.push(item.name);
      }
    }
    }
  });
  
  await User.findById(req.user.id, (error,user) => {
    if(error) {
      console.log(error)
    }
    else{
      file_path += '../.' + user.profile_pic
    }
  })

 await  Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        channels.push(item.name);
      }
    }
  });

  PrivateChat.findOne({ name: room_name })
    .populate({
      path: "messages",
      populate: { path: "message_sender", model: "User" },
    })
    .exec(function (error, result) {
      if (error) {
        return HandleError(error);
      } else {
        //console.log(result.messages);

        for (item of result.messages) {
          
          let message = {
            _id: item._id,
            message_sender: item.message_sender.name,
            message: item.message,
            file_path: '../.' + item.message_sender.profile_pic,
            date: item.date
          };
          
            db_messages.push(message);
          };
        
          res.render("rooms.ejs", {
            channelname: room_name,
            user: req.user,
            channels: channels,
            dm:dm,
            messages: db_messages,
            profile_pic: file_path,
          });
      }
    });
});

//upload new profile pic
router.post("/upload-profile-pic", (req, res) => {
  try {
    if (req.files) {
      let profile_pic = req.files.profile_pic;
      let id = req.user._id;

      let file_name = `./public/img/${id}`;

      profile_pic.mv(file_name);
      User.findByIdAndUpdate(id, {profile_pic: file_name},() => res.redirect("/dashboard"))
      
    } else {
      res.end("<h1> No file uploaded! </h1>");
    }
  } catch (error) {
    res.end(error);
  }
});

module.exports = router;
