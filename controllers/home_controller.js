const user = require("../models/users")

module.exports.home = (req,res)=>{
    if (req.isAuthenticated()) {
        return res.redirect("/users/posts");
    }
    return res.render("home",{
        title: "Home"
    });
}

