const express = require("express");
const app = express();
const fs = require('fs')

const { ensureAuthenticated } = require("../config/auth");
const Room = require("../models/room");
const User = require("../models/user");
const router = express.Router();




router.get("/", ensureAuthenticated, async (req, res) => {
  let userlist = []
  let id = req.user._id.toString()
  const images_folder = './public/img'
  let file_path = ""
  fs.readdir(images_folder,  (error, files) => {
      
      console.log(files)
      console.log(files.includes(id))
       if(files.includes(id))  {
         
        file_path = `./public/img/${id}` 
       }
       else {
       file_path = './public/img/Profile-Avatar'
       }
      })
      
 
   
    
    await User.find((error, result) => {
        if(error){
            console.log(error)
        }
        else {
            for(item of result){
                if (item.loggedin === true){
                    userlist.push(item.name)
                }
            }
            //console.log('userlist: ' + userlist)
          }
        })
  let channels = []
  await Room.find((error,result) => {
    if(error){
      console.log(error)
    }
    else{
    for(item of result)
    channels.push(item.name)
    }
    res.render("dashboard.ejs", { user: req.user, channels: channels, userlist:userlist, profile_pic: file_path });
  })
 
});

router.post('/', (req,res) => {
  console.log(req.body)
  const room = new Room({
    name: req.body.channelname
  })

  room.save()
        .then((value) => {
          
        })
        .catch((error) => console.log(error));
    

  res.redirect('/dashboard')
})

router.get("/:name", ensureAuthenticated,  (req, res) => {
  
  let userlist = []
  let db_messages = []
  let channels = []
  let room_name = req.params.name;

  let id = req.user._id.toString()
  const images_folder = './public/img'
  let file_path = ""
  fs.readdir(images_folder,  (error, files) => {
      
      console.log(files)
      console.log(files.includes(id))
       if(files.includes(id))  {
         
        file_path = `../public/img/${id}` 
        console.log(file_path)
       }
       else {
       file_path = '../public/img/Profile-Avatar'
       }
      })
      
 
 User.find((error,result)=>{
      if (error){
          console.log(error)
      }
      else{
        for(item of result){
            if (item.loggedin === true){
                userlist.push(item.name)
            }
        }
      }
      })

 
   Room.find((error,result) => {
    if(error){
      console.log(error)
    }
    else{
    for(item of result){
    channels.push(item.name)
    }
  }
})

   Room.findOne({name: room_name})
  .populate({path:'messages', populate: {path: 'message_sender', model: 'User'} })
  .exec(function (error, result) {
    if(error){
      return HandleError(error);
    }

    else{
      console.log(result)
    for(item of result.messages){
      let message = {
        _id: item._id,
        message_sender: item.message_sender.name,
        message: item.message

      }
      db_messages.push(message)
    }
    console.log('sista ' + file_path)
    res.render("rooms.ejs", { channelname: room_name, user: req.user, channels: channels, userlist:userlist, messages: db_messages, profile_pic: file_path });
  }
  })
})
  

router.post('/upload-profile-pic', (req,res) => {
  try {
      if(req.files){
          let profile_pic = req.files.profile_pic
          let id = req.user._id

          let file_name = `./public/img/${id}`

          profile_pic.mv(file_name)

          res.redirect('/dashboard')
      }
      else{
          res.end('<h1> No file uploaded! </h1>')
      }
  } catch(error){
      res.end(error)
  }
})
  


module.exports = router;
