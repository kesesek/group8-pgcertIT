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
const showNotifications = require("../middleware/notifications-middleware.js");
const articleDao = require("../modules/article-dao.js");

router.get("/login", function (req, res) {
    if (req.cookies.authToken) {
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
    if (user) {
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
    if (mName == "") {
        mName = null;
    }
    const lName = req.body.lname;
    let description = req.body.des;
    if (description == "Write something about you...") {
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

//when click the "Add Articles" button from the side bar
//the page would go to the "addarticle" page
router.get("/addarticle", function (req, res) {

    res.render("addarticle");
});

//in the "addarticle" page, user can write a whole new article and save it to the database, the redirect to the "My Articles" page
router.post("/submitArticle", upload.single("imageFile"), async function (req, res) {
    let title = req.body.title;
    if(title == "" || title == "<p>Title here...</p>"){
        title = "[Untitled]";
    }
    let content = req.body.content;
    if(content == "" || content == "<p>Content here...</p>"){
        content = "[Empty]";
    }
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    const fileInfo = req.file;
    let image_id;
    if(fileInfo != undefined){
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/uploadedFiles/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        image_id = await userDao.saveImageAndGetId(fileInfo.originalname);
    }
    if(image_id == undefined){
        image_id = null;
    }

    await userDao.addArticle(content, title, user_id, image_id);

    res.redirect("/myarticle");
});

//when click the "Favorite Articles" button in the side bar, the user can see the favorite articles interface
router.get("/favorite", async function(req, res){
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const articles = await userDao.retrieveLikedArticlesByUserId(user_idObj.id);
    
    res.locals.user_id = user_idObj.id;
    res.locals.articles = articles;
    res.render("favorite");
});

//in the favorite page, when click the dislike button, it will modifify the database and redirect back to the favorite page
router.get("/removeLikes", showNotifications, async function(req, res){
    const article_id = req.query.likeAction;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    await articleDao.removeLikedArticles(user_id, article_id);

    res.redirect("/favorite");
});


module.exports = router;
