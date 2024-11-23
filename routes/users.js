const express = require("express");
const router = express.Router();
const passport = require('passport');

const userController = require("../controllers/user_controller");

router.get("/profile", passport.checkAuthentication, userController.userProfile);
router.get("/posts", userController.userPosts);
router.get("/sign-up", userController.signUp);
router.get("/sign-in", userController.signIn);
router.post("/create", userController.create);
router.get("/sign-out", userController.destroySession);
router.get("/feed", userController.userFeed);

router.post("/create-session", passport.authenticate(
    'local',
    { failureRedirect: "/users/sign-in", failureMessage: "Invalid username or password" }
), userController.createSession);

module.exports = router;