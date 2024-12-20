const mongoose = require('mongoose');
const User = require('./users');

const groupMessageSchema = new mongoose.Schema({
    message: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);