const User = require("../models/users");
const Post = require("../models/posts");
const PrivateMessage = require("../models/privateMessage");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

// User profile page rendering action
module.exports.userProfile = (req, res) => {
  return res.render("profile", { title: "Profile" });
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
    // Validate form inputs
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

    if (password !== confirmPassword) {
      req.flash("alert", "Passwords do not match.");
      return res.redirect("/users/sign-up");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      req.flash("alert", "Email is already registered. Please sign in!");
      return res.redirect("/users/sign-in");
    }

    // Handle profile image upload if provided
    let profileImageUrl = null;
    console.log("img",req.file)
    if (req.file) {
      // Convert image to base64 and upload to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataURI);
      profileImageUrl = uploadResponse.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name,
      username: username,
      password: hashedPassword,
      imageUrl: profileImageUrl,
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
module.exports.userFeed = async (req, res) => {

  try {
    const posts = await Post.find();
    res.locals.posts = posts;
    return res.render("user-feed", {
      title: "Feed",
      layout: false,
      alert: req.flash("alert"),
      posts: posts
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Error in fetching posts" });
  }
};

// Create a post
module.exports.createPost = async (req, res) => {
  try {
    const post = req.body;
    const userId = req.user._id;

    await Post.create({ ...post, name: req.user.name, user: userId, time:  Date.now() });

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

// chat page rendering action
module.exports.chatPage = async (req, res) => {
  try {
    const userId = req.user._id; 
    const recipientId = req.params.recipientId;

    // Fetch all messages between the current user and the recipient
    const messages = await PrivateMessage.find({
      $or: [
        { from: userId, to: recipientId },
        { from: recipientId, to: userId },
      ],
    }).sort({ timestamp: 1 });

    const recipient = await User.findById(recipientId).select(
      "name username _id"
    );

    return res.render("chat-page", {
      title: `Chat with ${recipient.username}`,
      layout: false,
      user: res.locals.user, 
      recipientId: recipientId,
      messages: messages, 
      recipient: recipient, 
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).send("Error fetching messages");
  }
};

// action for adding a friend
module.exports.addFriend = async (req, res) => {
  try {
    const searchedFriendId = req.params.searchedFriendId;
    const searchedFriendName = req.params.searchedFriendName;
    const userId = req.user._id;

    // Check if the user is already a friend
    const currentUser = await User.findById(userId);
    const isAlreadyFriend = currentUser.friends.some(
      (friend) => friend._id.toString() === searchedFriendId
    );

    if (isAlreadyFriend) {
      return res.status(400).render("searched-user-profile", {
        title: searchedFriendName,
        layout: false,
        searchedUserDetails: {
          name: searchedFriendName,
          _id: searchedFriendId,
        },
        friend: true,
        alert: "User is already a friend.",
      });
    }

    // Add the friend if not already in the list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          friends: {
            _id: searchedFriendId,
            name: searchedFriendName,
          },
        },
      },
      { new: true }
    );

    const { imageUrl } = await User.findOne({ _id: searchedFriendId }).select("imageUrl").lean();

    if (updatedUser) {
      return res.status(200).render("searched-user-profile", {
        title: searchedFriendName,
        layout: false,
        searchedUserDetails: {
          name: searchedFriendName,
          _id: searchedFriendId,
          imageUrl: imageUrl
        },
        friend: true,
        alert: "Friend added successfully!",
      });
    }
  } catch (error) {
    console.error("Error in adding friend:", error);
    return res.status(500).render("searched-user-profile", {
      title: searchedFriendName,
      layout: false,
      searchedUserDetails: {
        name: searchedFriendName,
        _id: searchedFriendId,
      },
      friend: false,
      alert: "An error occurred while adding the friend. Please try again.",
    });
  }
};

// get searched user details
module.exports.getUser = async (req, res) => {
  try {
    const searchedUser = req.params.searchedUserId;
    const userId = req.user._id;

    const searchedUserDetails = await User.findOne({ _id: searchedUser });

    const friend = await User.findOne({
      _id: userId,
      friends: { $in: [{ _id: searchedUser }] },
    });
    let addedFriend = false;
    if (friend) {
      addedFriend = true;
    }

    if (searchedUserDetails) {
      return res.status(200).render("searched-user-profile", {
        title: searchedUserDetails.name,
        layout: false,
        searchedUserDetails: {
          name: searchedUserDetails.name,
          username: searchedUserDetails.username,
          _id: searchedUserDetails._id,
          imageUrl: searchedUserDetails.imageUrl
        },
        friend: addedFriend,
      });
    } else {
      console.log("user not found");
      return res.status(500);
    }
  } catch (error) {
    console.log("error in fetching profile", error);
    res.status(500);
  }
};

//search users
module.exports.searchUsers = async (req, res) => {
  const name = req.body.name;
  const currentUserId = req.user._id;

  const users = await User.find({
    name: name,
    _id: { $ne: currentUserId },
  }).select("_id name");

  if (users) {
    return res.status(200).render("user-search-result", {
      title: "user-search",
      layout: false,
      allUsers: users,
    });
  }

  console.log("no users found");
  return res.status(200).render("user-search-result", {
    title: "user-search",
    layout: false,
    allUsers: "",
  });
};

//suggest users to the current user
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
      } else {
        return res.status(200);
      }
    }
  } catch (error) {
    console.log("Error fetching users", error);
    return res.status(500);
  }
};
