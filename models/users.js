const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
    }]
    
},{timestamps: true});

const User = mongoose.model("User",userSchema);

module.exports = User;