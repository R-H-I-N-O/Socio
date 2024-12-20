const express = require("express");
const router = express.Router();
const passport = require('passport');
const upload = require("../config/multer");

const userController = require("../controllers/user_controller");

router.get("/profile", passport.checkAuthentication, userController.userProfile);
router.get("/sign-up", userController.signUp);
router.get("/sign-in", userController.signIn);
router.post("/create", upload.single('profileImage'), userController.create);
router.get("/sign-out", userController.destroySession);
router.get("/feed", passport.checkAuthentication ,userController.userFeed);
router.get("/:recipientId/chat", passport.checkAuthentication, passport.setAuthenticatedUser, userController.chatPage);
router.post("/search", passport.checkAuthentication, userController.searchUsers);

router.post("/:searchedFriendId/:searchedFriendName/add-friend/", passport.checkAuthentication, userController.addFriend);
router.get("/:searchedUserId", passport.checkAuthentication, userController.getUser);
router.get("/suggestedUsers", passport.checkAuthentication, userController.suggestUsers);

router.post("/create-session", passport.authenticate(
    'local',
    { failureRedirect: "/users/sign-in", failureMessage: "Invalid username or password" }
), userController.createSession);

router.post("/create-post", passport.checkAuthentication, userController.createPost);



module.exports = router;