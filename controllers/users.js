const User = require("../models/user");

module.exports.renderSingupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.singup = async(req,res) =>{
    try {
    let{username, email, password} = req.body;
    const newUser = new User({email, username});
    const registerUser =await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome To Wandurlust!");
        res.redirect("/listings");
});
 
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/singup");
    }
}


module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};


module.exports.login =  async(req,res) => {
    req.flash("success","Welcome To Wnadurlust! You are log-In.")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    console.log("Succesfull Login");
};

module.exports.logOut = (req,res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You are logout!");
        res.redirect("/listings");
    });
    console.log("Succesfull logout!");
};

