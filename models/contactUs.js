const mongoose = require('mongoose');
const { contactUs } = require('../controllers/help_controller');

const contactUsSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{timestamps: true});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;