const passport = require('passport');
const User = require('../models/users');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username'
},async (username,password,done)=>{
    const user = await User.findOne({username: username});
    try {
        if(!user || user.password != password){
            console.log("Incorrect username/password");
            return done(null,false);
        }
        return done(null,user);
    } catch (error) {
        console.log("Error in finding user --> passport");
        return done(error);
    }
}));

// adding user id into session cookie (encrypted)

passport.serializeUser((user,done)=>{
    return done(null,user.id);
});

// finding the user based on the id from the session key

passport.deserializeUser((id,done)=>{
    const user = User.findById(id);
    try {
        return done(null,user);
    } catch (error) {
        console.log("Error in fetching user details --> passport");
        return done(error);
    }
});

module.exports = passport;

