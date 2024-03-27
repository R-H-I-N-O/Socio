const User = require("../models/users");

// User profile page rendering action
module.exports.userProfile = (req,res)=>{
    return res.render("profile",{
        title: "Profile"
    });
}

// User posts page rendering action
module.exports.userPosts = (req,res)=>{
    return res.render("user-posts",{
        title: "Posts"
    });
}

// Sign in page rendering action
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render(
        "sign-in", {
        title: "Socio | Sign In"
    }
    )
}
module.exports.createSession = (req, res) => {
    return res.redirect("/users/posts");
}

// Sign up page rendering action
module.exports.signUp = (req, res) => {

    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render(
        "sign-up", {
        title: "Socio | SignUp"
    }
    );
}

// action to create user
module.exports.create = async (req, res) => {
    try {
        // Check if password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email: req.body.username });
        if (existingUser) {
            return res.redirect("/users/sign-in"); // Redirect to sign-in if user already exists
        }

        // Create new user
        await User.create(req.body);
        console.log(req.body);
        return res.status(201).redirect("/users/sign-in"); // Redirect to sign-in after successful creation
    } catch (error) {
        console.error("Error in user creation:", error);
        return res.status(500).send("Error in user creation");
    }
};

// Logout action
module.exports.destroySession = (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log("Error in logging out");
            return;
        }
        return res.redirect("/");
    });
}