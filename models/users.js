const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
    username:{
        type: String,
        reqired: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        reqired: true
    }
});

const User = mongoose.model("User",userSchema);

module.export = User;