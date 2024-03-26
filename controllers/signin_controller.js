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
    return res.redirect("/users/profile");
}