const express = require("express");
const app = express();
const { ensureAuthenticated } = require("../config/auth");
const Room = require("../models/room");
const User = require("../models/user");
const router = express.Router();




router.get("/", ensureAuthenticated, async (req, res) => {
  let userlist = []
  let id = req.user._id
   
    
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
    res.render("dashboard.ejs", { user: req.user, channels: channels, userlist:userlist });
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

router.get("/:name", ensureAuthenticated, async (req, res) => {
  
  let userlist = []
  let db_messages = []
  let channels = []
  let id = req.user._id 
  let room_name = req.params.name;
  await User.find((error,result)=>{
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

 
  await Room.find((error,result) => {
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
    for(item of result.messages){
      let message = {
        _id: item._id,
        message_sender: item.message_sender.name,
        message: item.message

      }
      db_messages.push(message)
    }
    console.log(result.messages)
    res.render("rooms.ejs", { channelname: room_name, user: req.user, channels: channels, userlist:userlist, messages: db_messages });
  
  })
})
  


  


module.exports = router;
