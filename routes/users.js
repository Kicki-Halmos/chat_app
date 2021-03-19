const express = require("express");
const app = express();
const User = require("../models/user");

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

module.exports = router;
