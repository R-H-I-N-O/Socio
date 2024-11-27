const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comment: [{
        content: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
        }
    }],
    likeCount: {
        type: Number
    },
    time: {
        type: Date
    }
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;