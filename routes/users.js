const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");

router.get("/profile",userController.userProfile);
router.get("/posts",userController.userPosts);

module.exports = router;