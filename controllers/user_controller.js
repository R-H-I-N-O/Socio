module.exports.userProfile = (req,res)=>{
    return res.render("profile",{
        title: "Profile"
    });
}

module.exports.userPosts = (req,res)=>{
    return res.end("<h1>User posts</h1>");
}