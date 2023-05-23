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

router.get("/login", function(req, res) {
    if(req.cookies.authToken) {
        res.redirect("/");
    } else {
        res.locals.layout = "loginSignup";
        res.render("login");
    }
});

router.post("/login", async function (req, res) {
    const username = req.body.username_input;
    const password = req.body.password_input;

    const user = await userDao.retrieveUserWithCredentials(username, password);
    if(user) {
        res.locals.user = user;
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

//Using Ajax create a page containing all user names from the database
router.get("/allusernames", async function (req, res) {
    const userNames = await userDao.getUsernames();

    res.send(userNames);
});

//from login page to the sign-up page
router.get("/signup", function (req, res) {

    res.render("signup");
});

//get the necessary data from the sign-up page, then create a new user into the database
//middle name and description could be null
//if user do not upload a photo as his Avatar, then the predifined Avatar(panda.png) would be used
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

//for editAcount page⬇️:
router.get("/editAccount", async function(res, req) {
    const authToken = req.cookie.authToken;
    const user = await userDao.getUserInfo(authToken);
    const userAvatar = await userDao.getUserAvatar(user.id);
    res.locals.user = user;
    res.locals.userAvatarName = userAvatar;
    res.render("editAccount", {layout: 'sidebar&nav'});
});

router.post("/verifyOldPassword", async function(res, req) {
    const oldPassword = req.body.oldPassword;
    
    const authToken = req.cookie.authToken;
    const user = await userDao.getUserInfo(authToken);
    const oldHashed = user.hashed_password;
    console.log(oldHashed);
    const salt = user.salt;
    console.log(salt);

    const iterations = user.iterations;
    console.log(iterations);

    const hashedInputOldPassword = await userDao.hashPassword(oldPassword, salt, iterations);

    if(hashedInputOldPassword === oldHashed ) {
        res.setToastMessage("Correct.");
    } else {
        res.setToastMessage("Password does not mach.");
    }

});

router.get("/getAvatars", async function(res, req){
    const images = await userDao.getAvatars();
    res.json({images:images});
    res.render("editAccount", {images:images});
});

router.post("/saveAll", async function(res, req) {
    const authToken = req.cookie.authToken;

    const avartarID = parseInt(req.body.avartarID);
    const avartarFileName = req.body.avartarFileName;
    const newName = req.body.newName;
    const newPassword = req.body.newPassword;
    const newDb = req.body.newDb;
    const newFname = req.body.newFname;
    const newMname = req.body.newMname;
    const newLname = req.body.newLname;
    const newDes = req.body.newDes;

    if(await userDao.isExist(avartarFileName)) {
        //true 已存在的文件 直接更新到user
        await userDao.updateUserAvatar(authToken, avartarID);
    } else {
        //false 新文件 创建ID 更新到user
        const newAvatarID = await userDao.saveUploadAndGetId(avartarFileName);
        await userDao.updateUserAvatar(authToken, newAvatarID);
    }

    if(newName !== null) {
        await userDao.updateUsername(authToken, newName);
    }

    if(newPassword !== null) {
        await userDao.updatePassword(authToken, newPassword);
    }
    
    if(newDb !== null) {
        await userDao.updateDateBrith(authToken, newDb);
    }

    if(newFname !== null) {
        await userDao.updateFname(authToken, newFname);
    }

    if(newMname !== null) {
        await userDao.updateMname(authToken, newMname);
    }

    if(newLname !== null) {
        await userDao.updateLname(authToken, newLname);
    }

    if(newDes !== null) {
        await userDao.updateDescription(authToken, newDes);
    }

//下面这两句有必要吗
    const user = await userDao.getUserInfo(authToken);
    res.locals.user = user;

    res.redirect("/editAccount");
})
//editAccount page ends

module.exports = router;
