const express = require('express');
const app = express();
const session = require('express-session');

const mongoose = require('mongoose');

// Setting up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: "keyboard",  // Corrected spelling from "keybord"
    resave: false,
    saveUninitialized: false,
   
}));
// Add this near the top, after you initialize your app
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });
  

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/userDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Import Routes
const userrouter = require('./Routes/userRoutes.js');  // Ensure these files exist
const adminrouter = require('./Routes/adminRoutes.js');

// Use Routes
app.use('/', userrouter);
app.use('/admin', adminrouter);



// Start Server=
const PORT = process.env.PORT || 40780;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
