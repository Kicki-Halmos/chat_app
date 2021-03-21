const express = require("express");
const app = express();
const Room = require("../models/room");
const User = require("../models/user");
const PrivateChat = require("../models/private_chat");

const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

app.use(express.json());

//login page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

//register page
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

//logout
router.get("/logout", (req, res) => {
    let user = req.user
    console.log(user)
    /*User.findByIdAndUpdate(user._id, {loggedin:false}, (error, result) => {
        if(error){
            console.log(error)
        }
        else{
            
        }
    })*/
    req.logout();
    res.redirect("/");

});

//login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);

  if (!name || !email || !password) {
    errors.push({ msg: "Please fill out all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Use at least 6 characters for your password" });
  }

  if (errors.length > 0) {
    res.render("register.ejs", {
      errors,
      name,
      email,
      password,
    });
  } else {
    const newUser = new User({
      name,
      email,
      password,
      loggedin: false,
    });

    bcrypt.hash(password, 10, function (error, hash) {
      // Store hash in your password DB.
      newUser.password = hash;

      newUser
        .save()
        .then((value) => {
          req.flash("success_msg", "You have been registered!");
          res.redirect("/users/login");
        })
        .catch((error) => console.log(error));
    });
  }
});

//me
router.get('/me', ensureAuthenticated, async(req,res) => {
  let channels = [];
  let dm = [];
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
  });

  await User.findById(req.user._id, (error, result) => {
    if(error){
      console.log(error)
    }
    else{
      let name = result.name
      let profile_pic = '.' + result.profile_pic
      let email = result.email
      res.render('profile_page.ejs', {
        profile_pic: profile_pic, 
        email: email, 
        name:name,
        channels: channels,
        dm: dm,
      })
    }
    
  
  })

})

//upload new profile pic
router.post("/upload-profile-pic", (req, res) => {
  try {
    if (req.files) {
      let profile_pic = req.files.profile_pic;
      let id = req.user._id;

      let file_name = `./public/img/${id}`;

      profile_pic.mv(file_name);
      User.findByIdAndUpdate(id, {profile_pic: file_name},() => res.redirect("/users/me"))
      
    } else {
      res.end("<h1> No file uploaded! </h1>");
    }
  } catch (error) {
    res.end(error);
  }
});

router.post("/new-email", (req, res) => {
  User.findByIdAndUpdate(req.user._id,{email: req.body.email}, (error,result) => {
    if(error){
      console.log(error)
    }
    else{
      res.redirect('/user/me')
    }
  })
});

module.exports = router;
