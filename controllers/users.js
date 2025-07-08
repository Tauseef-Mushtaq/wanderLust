const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            next(err);
        }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!, Login Successful");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Use the saved redirect URL or default to listings
    res.redirect(redirectUrl); // Redirect to the original URL or a safe route
}

module.exports.logout =  (req, res, next) => {
    req.logout((err)=> {
        if(err){
           return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings"); // Redirect to homepage or a safe route
    })
}