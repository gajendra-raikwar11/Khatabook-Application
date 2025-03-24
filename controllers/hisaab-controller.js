const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/user-model");

module.exports.createHisaabController = async function (req, res) {
    let { title, description, encrypted, shareable, passcode, editpermissions } = req.body;

    encrypted = encrypted === "on" ? true : false;
    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;


    try {
        let hisaabcreated = await hisaabModel.create({
            title,
            description,
            user: req.user._id,
            passcode,
            encrypted,
            shareable,
            editpermissions
        });

        let user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaabcreated._id);
        user.save();

        res.redirect("/profile")

    }
    catch (err) {
        res.send(err.message);
    }
}

module.exports.hisaabPageController = function (req, res) {
    res.render("create");
}