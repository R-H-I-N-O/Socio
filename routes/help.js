const express = require("express");
const router = express.Router();

const {contactPage, contactUsMessage } = require("../controllers/help_controller")

router.get("/contactus",contactPage);
router.post("/contactus/message",contactUsMessage);

module.exports = router;