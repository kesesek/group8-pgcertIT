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
        res.setToastMessage("Welcome to iBlogger! Start blogging here!");
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

    res.render("signup", {layout: 'loginSignup'});
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


//for editAcount page⬇️:
router.get("/editAccount", async function(req, res) {
    const authToken = req.cookies.authToken;
    
    const user = await userDao.getUserInfo(authToken);
    res.locals.user = user;
    res.render("editAccount", {layout: 'sidebar&nav'});
});

router.post("/verifyOldPassword", async function(req, res) {
    const oldPassword = req.body.oldPassword;
    
    const authToken = req.cookies.authToken;
    const user = await userDao.getUserInfo(authToken);
    const oldHashed = user.hashed_password;
    const salt = user.salt;

    const iterations = user.iterations;

    const hashedInputOldPassword = userDao.hashPassword(oldPassword, salt, iterations);

    if(hashedInputOldPassword === oldHashed ) {
        res.json(true);
    } else {

        res.json(false);
    }

});


router.post("/saveAll", upload.single('avatarFileName'),async function(req, res) {
    const authToken = req.cookies.authToken;
    const olduser = await userDao.getUserInfo(authToken);
    const preAvatar = req.body.checkedAvatar;
    const avatarFile = req.file;
    const newName = req.body.newName;
    const newPassword = req.body.newPassword;
    const newDb = req.body.newDb;
    const newFname = req.body.newFname;
    const newMname = req.body.newMname;
    const newLname = req.body.newLname;
    const newDes = req.body.newDes;

    if(preAvatar) {
        const avatarID = await userDao.getPreIconId(preAvatar);
        if(avatarID) {
            await userDao.updateUserAvatar(authToken, avatarID.id);
        }   
    } 
    
    if(avatarFile){
        const oldFileName = avatarFile.path;
        const newFileName = `./public/images/icons/${avatarFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        const newAvatarID = await userDao.saveUploadAndGetId(avatarFile.originalname);
        await userDao.updateUserAvatar(authToken, newAvatarID);
    }

    if(newName) {
        await userDao.updateUsername(authToken, newName);
    }

    if(newPassword) {
        const user = await userDao.getUserInfo(authToken);
        const salt = user.salt;
        const iteration = user.iterations;
        await userDao.updatePassword(authToken, salt, iteration, newPassword);
    }
    
    if(newDb) {

        await userDao.updateDateBrith(authToken, newDb);
    }

    if(newFname) {

        await userDao.updateFname(authToken, newFname);
    }

    if(newMname) {

        await userDao.updateMname(authToken, newMname);
    }

    if(newLname) {

        await userDao.updateLname(authToken, newLname);
    }

    if(newDes) {

        await userDao.updateDescription(authToken, newDes);
    }


    const user = await userDao.getUserInfo(authToken);
    res.locals.user = user;
    res.send({ success: true });
})

router.post("/delectAccount", async function(req, res){
    const authToken = req.cookies.authToken;
    await userDao.delectAccount(authToken);

    res.clearCookie('authToken');
    res.json({success: true});
})
//editAccount page ends

//when click the "Add Articles" button from the side bar
//the page would go to the "addarticle" page
router.get("/addarticle", function (req, res) {

    res.locals.active_AddArticles = true;
    res.render("addarticle", {layout: 'sidebar&nav'});
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
    res.locals.active_MyFavoriteArticles = true;
    res.render("favorite", {layout: 'sidebar&nav'});
});

//in the favorite page, when click the dislike button, it will modifify the database and redirect back to the favorite page
router.get("/removeLikes", showNotifications, async function(req, res){
    const article_id = req.query.likeAction;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    await articleDao.removeLikedArticles(user_id, article_id);

    res.redirect("/favorite");
});


// analytics page⬇️
router.get('/analytics', async function(req, res){
    const authToken = req.cookies.authToken;
    const user = await userDao.getUserInfo(authToken);
    const user_id = user.id;

    const followernumber = await userDao.countFollower(user_id);
    const commentsnumber = await userDao.totalNumberofUserPosts(user_id);
    const likes = await userDao.countlikes(user_id);
    const topThree = await userDao.getTopThree(user_id);

    res.locals.user = user;
    res.locals.followernumber = followernumber;
    res.locals.commentsnumber = commentsnumber;
    res.locals.likes = likes;

    if(topThree) {
        res.locals.topThree = topThree;
    }

    res.render("analytics", {layout: 'sidebar&nav'});
})

router.get('/commentdata', async function(req,res){
    const authToken = req.cookies.authToken;
    const user = await userDao.getUserInfo(authToken);
    const user_id = user.id;

    let tenDaysData = [];
    let currentDate = new Date();
    for(let i = 0; i < 10; i++){
        let date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        let year = date.getFullYear();

        let month = date.getMonth() + 1; 
        if(month < 10) {
            month = '0' + month;
        }

        let day = date.getDate();
        if(day < 10) {
            day = '0' + day;
        }

        let formattedDate = `${year}-${month}-${day}`;
        let commentNum = await userDao.dailyAllArticleCommentsNumber(formattedDate, user_id);

        let thisdate = `${month}-${day}`;
        let thiscomments = commentNum;
        let obj = {
            date:thisdate,
            commentNum:thiscomments
        };

        tenDaysData.unshift(obj);
    }
    res.send(tenDaysData);
});

router.get('/popularitydata', async function(req, res){
    const authToken = req.cookies.authToken;
    const user = await userDao.getUserInfo(authToken);
    const user_id = user.id;

    let popularitydata = [];
    const articleArray = await userDao.getAllArticle(user_id);
    if(articleArray) {
        for(let i = 0; i < articleArray.length; i ++) {
            let thisID = articleArray[i].id;
            let thisLikes = await userDao.countArticlelike(thisID);
            let thisComments = await userDao.countArticleComment(thisID);
            let thisPopularity = userDao.getArticlePopularity(thisComments, thisLikes);
            let thisArticle = {id:thisID, popularity:thisPopularity};
            popularitydata.push(thisArticle);
        }
        popularitydata.sort((a, b) => a.id - b.id);
        popularitydata = popularitydata.map((obj, index) => ({
            ...obj,
            index: index + 1
          }));
    }
    res.send(popularitydata);

});


module.exports = router;
