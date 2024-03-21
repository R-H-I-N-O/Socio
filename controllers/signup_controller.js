module.exports.signUp = (req,res)=>{
    return res.render(
        "sign-up",{
            title: "Socio | SignUp"
        }
    );
}