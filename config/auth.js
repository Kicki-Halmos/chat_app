const User = require("../models/user");
module.exports = {
    ensureAuthenticated: (req, res, next) => {
         //let id = req.user._id
        if (req.isAuthenticated()) {
            return next()
        } else {
           
            /*User.findByIdAndUpdate(
                id,
                { loggedin: false },
                (error, result) => {
                  if (error) {
                    
                  } else {
                    
                  }
                }
              );*/
            req.flash('error_msg', 'Please login to view this resource')
            res.redirect('/users/login')
        }
    },

   /*checkUserForPrivateChat: (req,res, next) {
        if(req.user == )
    }*/
}