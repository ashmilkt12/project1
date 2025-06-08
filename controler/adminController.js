const b=require('bcrypt')
const usermodel=require("../model/user")
const adminCredential = {
    username: "admin",
    password: "admin123",
};

const getLogin = (req, res) => {
    res.render('adminlogin');
};

const postLogin = async (req, res) => {
    const { username, password } = req.body;
   
    if (!username || !password) {
        return res.render("adminlogin", { errorMessage: "All fields are required" });
    }
    if (username.length < 4) {
        return res.render("adminlogin", { errorMessage: "Username must be at least 4 characters long" });
    }
    if (password.length < 6) {
        return res.render('adminlogin', { errorMessage: "Password must be at least 6 characters long" });
    }

    // Check credentials (without bcrypt)
    if (username !== adminCredential.username || password !== adminCredential.password) {
        return res.render("adminlogin", { errorMessage: "Invalid username or password" });
    }

    // Store session
    req.session.admin = { username };
    // console.log("Admin logged in:", req.session.admin);
    res.redirect("/admin/dashboard");
};

const getDashboard = async (req, res) => {
    try {
        const users = await usermodel.find();
        res.render('adminDashboard', { users });
    } catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).send('Internal Server Error');
    }
};

const logout = (req, res) => {
    try {
        req.session.destroy((err)=>{
            if(err){
                res.send("error while logouting",err)
            }
            return res.redirect("/admin/login")
        })
    } catch (error) {
        console.error('unexpected error',error)
        return res.status(500).send('internal server error')
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await usermodel.find();
        res.render("adminDashboard", { users });
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
};

const getCreateUser = (req, res) => {
    res.render('createUser'); // Create a separate 'createUser.ejs' page if needed
};

const postCreateUser = async (req, res) => {
    let { email, password } = req.body;

    if (!password || !email) {
        const users = await usermodel.find(); 
        return res.render("adminDashboard", { users, errorMessage: "All fields are required" });
    }

    try {
        password= await   b.hash(password,10)
        const newUser = new usermodel({ password, email });
        await newUser.save();
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error(err);
        const users = await usermodel.find();
        res.render("adminDashboard", { users, errorMessage: "Error creating user" });
    }
};

const getEditUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        console.log("Rendering edituser view");
        res.render("edituser", { user });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Error fetching user");
    }
};

const postEditUser = async (req, res) => {
    const { email, password } = req.body;
    const { id } = req.params;

    if (!email) {
        const users = await usermodel.find();
        return res.render("adminDashboard", { users, errorMessage: "Email is required" });
    }

    try {
        const user = await usermodel.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Update email
        user.email = email;

        // Update password if provided
        if (password) {
            user.password = password;
        }

        await user.save();
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send("Error updating user");
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await usermodel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user");
    }
};

module.exports = {
    getLogin,
    postLogin,
    logout,
    getDashboard,
    deleteUser,
 
    postCreateUser,
    getUsers,
    getCreateUser,
    getEditUser,
    postEditUser,
};
