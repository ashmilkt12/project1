const mongoose = require("mongoose"); // Fix: Require mongoose, not express

const UserSchema = new mongoose.Schema({

    // Fix: 'require' should be 'required'
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin:{type:Boolean,default:false}
});

module.exports = mongoose.model("User", UserSchema);
