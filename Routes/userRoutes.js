const express = require('express');
const router = express.Router();
const usercontroller = require('../controler/userController.js'); 
const {authmiddleware,preventauthaccess}=require('../middleware/user.js')
// Routes
router.get('/', preventauthaccess,usercontroller.getsignup);
router.get('/home', authmiddleware,usercontroller.homepage);
router.post('/', usercontroller.Postsignup);
router.post('/login', usercontroller.postlogin);
router.get('/login',preventauthaccess,usercontroller.getlogin);
router.get('/logout', usercontroller.logout);

module.exports = router; 