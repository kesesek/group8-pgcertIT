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
const notificationDao = require("../modules/notification-dao.js");

router.get("/login", showNotifications, function (req, res) {
    if (req.cookies.authToken) {
        res.redirect("/");
    } else {
        res.locals.layout = "loginSignup";
        res.render("login");
    }
});

router.post("/login", showNotifications, async function (req, res) {
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
router.get("/signup", showNotifications, function (req, res) {

    res.render("signup", { layout: 'loginSignup' });
});

//get the necessary data from the sign-up page, then create a new user into the database
//middle name and description could be null
//if user do not upload a photo as his Avatar, then the predifined Avatar(panda.png) would be used
router.post("/signup", showNotifications, upload.single("avatar"), async function (req, res) {
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
        const newFileName = `./public/images/icons/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        icon_id = await userDao.saveUploadAndGetId(fileInfo.originalname);
    }

    await userDao.createUser(userName, fName, mName, lName, description, birth, salt, iterations, hashed_password, icon_id);

    res.redirect("/login");
});


//for editAcount page⬇️:
router.get("/editAccount", showNotifications, async function (req, res) {
    res.locals.title = "Edit Account";
    const authToken = req.cookies.authToken;

    const user = await userDao.getUserInfo(authToken);
    res.locals.user = user;
    res.locals.active_EditAccount = true;
    res.render("editAccount", { layout: 'sidebar&nav' });
});

router.post("/verifyOldPassword", showNotifications, async function (req, res) {
    const oldPassword = req.body.oldPassword;

    const authToken = req.cookies.authToken;
    const user = await userDao.getUserInfo(authToken);
    const oldHashed = user.hashed_password;
    console.log(oldHashed);
    const salt = user.salt;
    console.log(salt);

    const iterations = user.iterations;
    console.log(iterations);

    const hashedInputOldPassword = userDao.hashPassword(oldPassword, salt, iterations);

    if (hashedInputOldPassword === oldHashed) {
        console.log('true');
        res.json(true);
    } else {
        console.log('false');

        res.json(false);
    }

});



router.post("/saveAll", showNotifications, upload.single('avatarFileName'), async function (req, res) {
    console.log('in saveAll');

    const authToken = req.cookies.authToken;
    const olduser = await userDao.getUserInfo(authToken);
    console.log(olduser);
    const preAvatar = req.body.checkedAvatar;
    const avatarFile = req.file;
    const newName = req.body.newName;
    const newPassword = req.body.newPassword;
    const newDb = req.body.newDb;
    const newFname = req.body.newFname;
    const newMname = req.body.newMname;
    const newLname = req.body.newLname;
    const newDes = req.body.newDes;
    console.log(preAvatar);//null
    console.log(avatarFile);//undefined
    console.log(newName);//new


    if (avatarFile == undefined) {
        const avatarID = await userDao.getPreIconId(preAvatar);
        console.log(avatarID);//undefined
        if (avatarID) {
            console.log('in ifif');
            console.log(avatarID.id);
            await userDao.updateUserAvatar(authToken, avatarID.id);
        }
    }

    if (avatarFile) {
        console.log("2 if");
        const oldFileName = avatarFile.path;
        const newFileName = `./public/images/icons/${avatarFile.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        const newAvatarID = await userDao.saveUploadAndGetId(avatarFile.originalname);
        await userDao.updateUserAvatar(authToken, newAvatarID);
    }

    if (newName) {
        console.log("3 if");

        await userDao.updateUsername(authToken, newName);
    }

    if (newPassword) {
        console.log("4 if");
        const user = await userDao.getUserInfo(authToken);
        const salt = user.salt;
        const iteration = user.iterations;
        console.log('get salt ' + salt);
        await userDao.updatePassword(authToken, salt, iteration, newPassword);
    }

    if (newDb) {
        console.log("4 if");

        await userDao.updateDateBrith(authToken, newDb);
    }

    if (newFname) {
        console.log("5 if");

        await userDao.updateFname(authToken, newFname);
    }

    if (newMname) {
        console.log("6 if");

        await userDao.updateMname(authToken, newMname);
    }

    if (newLname) {
        console.log("7 if");

        await userDao.updateLname(authToken, newLname);
    }

    if (newDes) {
        console.log("8 if");
        await userDao.updateDescription(authToken, newDes);
    }


    const user = await userDao.getUserInfo(authToken);
    res.locals.user = user;
    res.send({ success: true });
})

router.post("/delectAccount", showNotifications, async function (req, res) {
    const authToken = req.cookies.authToken;
    await userDao.delectAccount(authToken);

    res.clearCookie('authToken');
    console.log(authToken);
    res.json({ success: true });
})
//editAccount page ends

//when click the "Add Articles" button from the side bar
//the page would go to the "addarticle" page
router.get("/addarticle", showNotifications, async function (req, res) {
    res.locals.title = "Add Articles";
    const article_id = req.query.edit;
    let article;
    if (article_id !== undefined) {
        article = await userDao.getArticleById(article_id);
        res.locals.article = article;
    }

    res.locals.active_AddArticles = true;
    res.render("addarticle", { layout: 'sidebar&nav' });
});

//in the "addarticle" page, user can write a whole new article and save it to the database, then redirect to the "My Articles" page
router.post("/submitArticle", showNotifications, upload.single("imageFile"), async function (req, res) {
    let title = req.body.title;
    if (title == "" || title == "<p>Title here...</p>") {
        title = "[Untitled]";
    }
    let content = req.body.content;
    if (content == "" || content == "<p>Content here...</p>") {
        content = "[Empty]";
    }
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    const fileInfo = req.file;
    let image_id;
    if (fileInfo != undefined) {
        const oldFileName = fileInfo.path;
        const newFileName = `./public/images/uploadedFiles/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        image_id = await userDao.saveImageAndGetId(fileInfo.originalname);
    }
    if (image_id == undefined) {
        image_id = null;
    }

    const article_id = req.body.article;
    if (article_id !== "") {
        await userDao.updateArticleById(article_id, content, title, image_id);
    } else {
        await userDao.addArticle(content, title, user_id, image_id);
    }

    // insert new 'publish an article' notifications to the notification table
    const followerArray = await userDao.retrieveFollowerByUserId(user_id);
    const articleId = await articleDao.retrieveArticleByContentTitleUserId(content, title, user_id);
    followerArray.forEach(async follower => {
        await notificationDao.addNotificationWithNewArticle(articleId.id, user_id, follower.id);
    });

    res.redirect("/profile");
});

//when click the "Favorite Articles" button in the side bar, the user can see the favorite articles interface
router.get("/favorite", showNotifications, async function (req, res) {
    res.locals.title = "Favorite Articles";
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const articles = await userDao.retrieveLikedArticlesByUserId(user_idObj.id);
    articles.forEach(article => {
        article.content = article.content.substring(0, 100) + "...";
    });
    res.locals.user_id = user_idObj.id;
    res.locals.articles = articles;

    res.locals.active_MyFavoriteArticles = true;
    res.render("favorite", { layout: 'sidebar&nav' });
});

//in the favorite page, when click the dislike button, it will modify the database and redirect back to the favorite page
router.get("/removeLikes", showNotifications, async function (req, res) {
    const article_id = req.query.likeAction;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    await articleDao.removeLikedArticles(user_id, article_id);

    res.redirect("/favorite");
});

//when click the "following" button in the side bar, it will display the following page
router.get("/following", showNotifications, async function (req, res) {
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const following = await userDao.retrieveFollowingByUserId(user_idObj.id);

    res.locals.following = following;
    res.locals.active_Following = true;
    res.render("following", { layout: 'sidebar&nav' });
});

//when click the "Unsubcribe" button in the following page, it will modify the database then redirect back to the following page
router.get("/nofollowing", showNotifications, async function (req, res) {
    const blogger_id = req.query.bTn;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    await userDao.unsubscribeWithUserIdAndArticleId(user_idObj.id, blogger_id);

    res.redirect("/following");
});

//when click the "follower" button in the side bar, it will display the follower page
router.get("/follower", showNotifications, async function (req, res) {
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const follower = await userDao.retrieveFollowerByUserId(user_idObj.id);

    res.locals.follower = follower;
    res.locals.active_Follower = true;
    res.render("follower", { layout: 'sidebar&nav' });
});

//when click the "remove" button in the follower page, it will modify the database then redirect back to the follower page
router.get("/nofollower", showNotifications, async function (req, res) {
    const fans_id = req.query.bTn;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    await userDao.unsubscribeWithUserIdAndArticleId(fans_id, user_idObj.id);

    res.redirect("/follower");
});

//when go to the other user's profile, the page will display the target user's articles
router.get("/profile", showNotifications, async function (req, res) {
    res.locals.title = "User Articles";
    if (req.cookies.authToken) {
        const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
        let targetId = req.query.otherUserId;
        if (targetId == undefined || targetId == user_idObj.id) {
            res.locals.active_myArticle = true;
            targetId = user_idObj.id;
        }
        const articles = await userDao.retrieveUserArticlesByTargetId(targetId);
        const likedArticleIds = await userDao.retrieveLikedArticleIdsByUserId(user_idObj.id);
        for (let i = 0; i < articles.length; i++) {
            articles[i].content = articles[i].content.substring(0, 100) + "...";
            for (let j = 0; j < likedArticleIds.length; j++) {
                if (articles[i].id === likedArticleIds[j].article_id) {
                    articles[i].isLiked = true;
                    break;
                } else {
                    articles[i].isLiked = false;
                }
            }
            if (targetId == user_idObj.id) {
                articles[i].canModify = true;
            } else {
                articles[i].canModify = false;
            }
        }
        res.locals.articles = articles;

        res.render("profile", { layout: 'sidebar&nav' });
    } else {
        res.redirect("/");
    }
    
});

//user remove liked articles in the profile page
router.get("/removeCollect", showNotifications, async function (req, res) {
    const article_id = req.query.likeAction;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    await articleDao.removeLikedArticles(user_id, article_id);

    const targetIdObj = await userDao.retrieveAuthorIdByArticleId(article_id);
    const targetId = targetIdObj.author_id;

    res.redirect(`/profile?otherUserId=${targetId}`);
});

//user add like to the article in the profile page
router.get("/addCollect", showNotifications, async function (req, res) {
    const article_id = req.query.likeAction;
    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);
    const user_id = user_idObj.id;
    await articleDao.insertLikedArticles(user_id, article_id);

    const targetIdObj = await userDao.retrieveAuthorIdByArticleId(article_id);
    const targetId = targetIdObj.author_id;

    res.redirect(`/profile?otherUserId=${targetId}`);
});

router.get("/deleteArticle", showNotifications, async function (req, res) {
    const article_id = req.query.delete;
    await userDao.deleteArticleById(article_id);

    const user_idObj = await userDao.retrieveUserIdWithAuthToken(req.cookies.authToken);

    res.redirect(`/profile?otherUserId=${user_idObj.id}`);
});



module.exports = router;
