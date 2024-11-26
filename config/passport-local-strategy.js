const passport = require('passport');
const User = require('../models/users');
const bcrypt = require('bcrypt')

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    const user = await User.findOne({ username: username });
    const isPasswordMatch = await bcrypt.compare(password, user.password, (err, result) => result);
    try {
        if (!user || isPasswordMatch) {
            console.log("Incorrect username/password");
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.log("Error in finding user --> passport");
        return done(error);
    }
}));

// adding user id into session cookie (encrypted)

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

// finding the user based on the id from the session key

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    try {
        return done(null, user);
    } catch (error) {
        console.log("Error in fetching user details --> passport");
        return done(error);
    }
});

// checking whether the user is authenticated or not
passport.checkAuthentication = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/users/sign-in");
};

// Setting authenticated user's data into locals to use in views
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = {
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
        };
    }
    return next();
}


module.exports = passport;

