const express = require("express");
const router = express.Router();

const helpController = require("../controllers/help_controller")

router.get("/contactus",helpController.contactUs);

module.exports = router;