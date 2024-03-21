module.exports.signIn = (req,res)=>{
    return res.render(
        "sign-in", {
            title: "Socio | Sign In"
        }
    )
}