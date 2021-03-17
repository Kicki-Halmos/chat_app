const User = require("../models/user");
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        
        if (req.isAuthenticated()) {
            return next()
        } else {
            /*User.findByIdAndUpdate(
                req.user.id,
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
    }
}