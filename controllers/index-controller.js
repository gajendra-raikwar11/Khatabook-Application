const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");
const bcrypt = require("bcrypt");
const path = require("path");
const { match } = require("assert");
const { options } = require("../routes/hisaab-router");

module.exports.landingPageController = function (req, res) {
    res.render("index", { loggedin: false });
}
module.exports.registerPageController = function (req, res) {
    res.render("register");
}
module.exports.registerController = async function (req, res) {
    let { username, name, email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) return res.render("you already have an account , please login.");

        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        user = await userModel.create({
            username,
            name,
            email,
            password: hashed
        })
        let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY);

        res.cookie("token", token); //used for save jwt token
        res.send("account created successfully..");
    }
    catch (err) {
        res.send(err.message);
    }
};

module.exports.loginController = async function (req, res) {
    let { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email }).select("+password");
        if (!user) return res.send("you need to register first!!");

        let result = await bcrypt.compare(password, user.password)

        if (result) {
            let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY);

            res.cookie("token", token);
            return res.redirect("profile");
        }
        else {
            return res.send("your details are in correct!!");
        }
    }
    catch (err) {
        console.log(err.message);
    }

}

 
module.exports.logoutController = function (req, res) {
    res.cookie("token", "");
    return res.redirect("/");
}

module.exports.profileController = async function (req, res) {
  
   //these is all about hisaab filter
   let byDate = Number(req.query.byDate);
   let {startDate , endDate} = req.query;

   byDate = byDate ? byDate : -1;
   startDate = startDate ? startDate : new Date("2000-01-01");
   endDate = endDate ? endDate : new Date();

    let user = await userModel.findOne({ email: req.user.email }).populate({
        path:"hisaab",
        match: {createdAt : { $gte : startDate , $lte : endDate}},
        options :{ sort : {createdAt : byDate}},
    });

    res.render("profile", { user }); 
};
