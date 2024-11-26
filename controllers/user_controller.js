const User = require("../models/users");
const Post = require("../models/posts");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// User profile page rendering action
module.exports.userProfile = (req, res) => {
  return res.render("profile", { title: "Profile" });
};

// User posts page rendering action
module.exports.userPosts = (req, res) => {
  return res.render("user-posts", { title: "Posts" });
};

// Sign in page rendering action
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign-in", {
    title: "Socio | Sign In",
    alert: req.flash("alert"),
  });
};

// Create session after sign in
module.exports.createSession = (req, res) => {
  return res.redirect("/users/feed");
};

// Sign up page rendering action
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("sign-up", {
    title: "Socio | Sign Up",
    alert: req.flash("alert"),
  });
};

// Create a new user
module.exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "alert",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      return res.redirect("/users/sign-up");
    }

    const { name, username, password, confirmPassword } = req.body;

    // Check password match
    if (password !== confirmPassword) {
      req.flash("alert", "Passwords do not match.");
      return res.redirect("/users/sign-up");
    }

    // Check if user exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      req.flash("alert", "Email is already registered. Please sign in!");
      return res.redirect("/users/sign-in");
    }
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      username: username,
      password: hashedPassword,
    });

    req.flash("alert", "Sign-up successful. Please sign in.");
    return res.redirect("/users/sign-in");
  } catch (error) {
    console.error("Error creating user:", error);
    req.flash("alert", "An error occurred. Please try again.");
    return res.redirect("/users/sign-up");
  }
};

// Logout action
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      req.flash("alert", "Error logging out. Please try again.");
      return res.redirect("/users/profile");
    }
    req.flash("alert", "You have successfully logged out.");
    return res.redirect("/");
  });
};

// User feed page rendering action
module.exports.userFeed = (req, res) => {
  return res.render("user-feed", {
    title: "Feed",
    layout: false,
    alert: req.flash("alert"),
  });
};

// Create a post
module.exports.createPost = async (req, res) => {
  try {
    const post = req.body;
    const userId = req.user._id;

    await Post.create({ ...post, user: userId });

    req.flash(
      "alert",
      JSON.stringify({
        type: "success",
        message: "Your post has been created successfully!",
      })
    );
    return res.redirect("/users/feed");
  } catch (error) {
    console.error("Error creating post:", error);
    req.flash(
      "alert",
      JSON.stringify({
        type: "error",
        message: "Error creating post. Please try again.",
      })
    );
    return res.redirect("/users/feed");
  }
};

module.exports.fetchPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Error in fetching posts" });
  }
};

// User feed page rendering action
module.exports.chatPage = (req, res) => {
  return res.render("chat-page", {
    title: "Chat",
    layout: false,
    user: res.locals.user,
  });
};

// action for adding a friend
module.exports.addFriend = async (req, res) => {
  try {
    const searchedFriend = req.params();
    const userId = req.user._id;

    const addedFriend = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { friends: searchedFriend } },
      { new: true }
    );

    if (addedFriend) {
      res.locals.addedFriend = true;
      return res.status(201);
    }
  } catch (error) {
    console.log("error in adding friend", error);
    res.status(500);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const searchedUser = req.params();
    const userId = req.user._id;

    const searchedUserDetails = await User.findOne({ _id: searchedUser });

    const friend = await User.findOne({
      _id: userId,
      friends: { $in: [searchedUser] },
    });

    if (friend) {
      res.locals.addedFriend = true;
    } else {
      res.locals.addedFriend = false;
    }

    if (searchedUserDetails) {
      res.locals.searchedUserDetails = {
        name: searchedUserDetails.name,
        username: searchedUserDetails.username,
      };
      return res.status(200);
    } else {
      console.log("user not found");
      return res.status(500);
    }
  } catch (error) {
    console.log("error in fetching profile", error);
    res.status(500);
  }
};

module.exports.searchUsers = async (req, res) => {
  const name = req.body.name;

  const users = await User.find({ name: name });

  if (users) {
    res.locals.allUsers = users;
    return res.status(200);
  }

  console.log("no users found");
  return res.status(200).render('user-search-result', {
    title: "user-search",
    layout: false,
  });
};

module.exports.suggestUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    if (currentUser) {
      const latestNonFriends = await User.find({
        _id: { $nin: currentUser.friends.concat(currentUserId) },
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .select("_id email username");
      if (latestNonFriends) {
        req.locals.suggestedUsers = latestNonFriends;
        return res.status(200);
      } else{
        return res.status(200);
      }
    }
  } catch (error) {
    console.log("Error fetching users", error);
    return res.status(500);
  }
};
