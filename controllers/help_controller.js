const ContactUs = require("../models/contactUs");

contactPage = (req,res)=>{
    return res.render("contact_us",{
        title: "Contact Us"
    });
}

contactUsMessage = async (req,res)=>{
    try{
        await ContactUs.create(req.body);
        // console.log(req.body);
        return res.status(201).render("feedback",{
            title: "Contact Us"
        }); // Redirect to thank you page
    } catch (error) {
        // console.error("Error in sending message:", error);
        return res.status(500).send("Error in sending message");
    }
}

module.exports = {contactPage, contactUsMessage}