const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
const signUpController = require("../controllers/signup_controller");
const signInController = require("../controllers/signin_controller");


router.get("/profile",userController.userProfile);
router.get("/posts",userController.userPosts);
router.get("/sign-up",signUpController.signUp);
router.get("/sign-in",signInController.signIn);
router.post("/create",signUpController.create);

module.exports = router;