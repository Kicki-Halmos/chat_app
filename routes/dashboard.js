const express = require("express");
const app = express();
const { ensureAuthenticated } = require("../config/auth");
const User = require('../models/user')
const router = express.Router();


//const getUsers = require('../api/users')
//let loggedInUsers = []
//app.use(express.json())

router.get("/", ensureAuthenticated, async (req, res) => {
    let userlist = []
    let id = req.user._id
    /*await User.findByIdAndUpdate(id, {loggedin: true}, (error, result) => {
        if(error){
            console.log(error)
        }
        else{
            console.log(result)
        }
    })
    console.log(req.user)
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
            console.log('userlist: ' + userlist)*/
            res.render('dashboard.ejs', {user: req.user})
})

router.get("/:name", ensureAuthenticated, async (req, res) => {
let userlist = []
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

  res.render("rooms.ejs", { channelname: room_name, user: req.user});
      }
  })
});

module.exports = router;
