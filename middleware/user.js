const User = require('../model/user');

const authmiddleware = (req, res, next) => {
    if (!req.session.user) {
   
   
        return res.redirect('/login');
    }
    next()
};

// Middleware: Prevent Logged-in Users from Accessing Login/Signup Pages
const preventauthaccess = (req, res, next) => {
    if (req.session.user) {
  
        return res.redirect("/home");
    }
   next()
   
};
module.exports={authmiddleware,preventauthaccess}

