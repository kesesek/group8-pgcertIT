// user authentication 
const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

//upload the Avatar
const multer = require("multer");
const upload = multer({
    dest: "temp"
});
const fs = require("fs");

const userDao = require("../modules/user-dao.js");

router.get("/login", function (req, res) {
    if (res.locals.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

router.post("/login", async function (req, res) {
    const username = req.body.username_input;
    const password = req.body.password_input;

    const user = await userDao.retrieveUserWithCredentials(username, password);

    console.log(user);

    if (user) {
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.redirect("/");
    } else {
        res.locals.user = null;
        res.setToastMessage("The username or password is wrong, please try agin.");
        res.redirect("./login");
    }
});

router.get("/allusernames", async function (req, res) {
    const userNames = await userDao.getUsernames();

    res.send(userNames);
});

router.get("/signup", function (req, res) {

    res.render("signup");
});

router.post("/signup", upload.single("avatar"), async function (req, res) {
    const userName = req.body.username;
    const fName = req.body.fname;
    let mName = req.body.mname;
    if(mName == ""){
        mName = null;
    }
    const lName = req.body.lname;
    let description = req.body.des;
    if(description == "Write something about you..."){
        description = null;
    }
    const birth = req.body.dateOfBirth;
    const salt = (Math.floor(Math.random() * 10) + 1).toString();
    const iterations = Math.floor(Math.random() * (9999 - 9000 + 1)) + 9000;
    const passWord = req.body.password;
    const hashed_password = userDao.hashPassword(passWord, salt, iterations);

    const fileInfo = req.file;
    const preAvatar = req.body.presetAvatar;

    let icon_id;
    if (fileInfo == undefined) {
        const iconIdObj = await userDao.getPreIconId(preAvatar);
        icon_id = iconIdObj.id;
    } else {
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/uploadedFiles/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        icon_id = await userDao.saveUploadAndGetId(fileInfo.originalname);
    }

    await userDao.createUser(userName, fName, mName, lName, description, birth, salt, iterations, hashed_password, icon_id);

    res.redirect("/login");
});

module.exports = router;
