const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
       
        usernameField: "email",
        
        passReqToCallback: true
      },
      function (req, username, password, done) {
  
        User.findOne((username.includes('@')) ? {email:username} : {name:username}, function (error, user) {
          if (error) {
            return done(error);
          }

          if (!user) {
            return done(null, false, req.flash('error_msg', "Incorrect username or email."));
          }

          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              throw error;              
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, req.flash('error_msg', "Incorrect password."));
            }
          });
        }).catch((error) => console.log(error));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
