const bcrypt = require("bcrypt");
const User = require("../model/user.js");

// Signup Page
const getsignup = (req, res) => {
    res.render('userSignup', { errorMessage: null });
};

// Login Page
const getlogin = (req, res) => {
    res.render('userLoginpage', { errorMessage: null });
};

// User Homepage
const homepage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home', { user: req.session.user });
};

// Handle User Signup
const Postsignup = async (req, res) => {
    const { name, email, username, password, confirm_password } = req.body;

    // Validation
    if (!name || !email || !username || !password || !confirm_password) {
        return res.render('userSignup', { errorMessage: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.render('userSignup', { errorMessage: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("userSignup", { errorMessage: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.render("userSignup", { errorMessage: "Error creating user" });
    }
};

// Handle Login
const postlogin = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.render("userLoginpage", { errorMessage: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("userLoginpage", { errorMessage: "Incorrect email or password" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("userLoginpage", { errorMessage: "Incorrect email or password" });
        }

        // Store session
        req.session.user = { _id: user._id, email: user.email };

        res.redirect("/home");
    } catch (error) {
        console.error(error);
        return res.render("userLoginpage", { errorMessage: "Something went wrong" });
    }
};

// Handle Logout
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout Error:", err);
            return res.redirect("/home");
        }
        res.redirect("/login");
    });
};

module.exports = { postlogin, Postsignup, homepage, getlogin, getsignup, logout };
