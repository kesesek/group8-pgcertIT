const express = require("express");
const router = express.Router();

const showNotifications = require("../middleware/notifications-middleware.js");

const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/user-dao.js");

router.get("/", showNotifications, async function(req, res) {
  
    res.locals.title = "Home Page";
    res.locals.active_HomePage = true;

    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        res.locals.username = user.username;
        res.setToastMessage("Welcome to iBlogger! Start blogging here!");
    }
    res.locals.article = await articleDao.retrievePartialArticles(6, userId);
    res.render("home");

});

router.get("/allArticles", showNotifications, async function(req, res) {
  
    res.locals.title = "All Articles";
    res.locals.active_AllArticlesPage = true;
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
    }
    const articleNumbers = await articleDao.retrieveArticleNumbers();
    res.locals.article = await articleDao.retrievePartialArticles(articleNumbers.count,userId);

    res.render("allArticles");

});

router.get("/sortArticles", showNotifications, async function(req, res) {
  
    res.locals.title = "Sorted Articles";
    res.locals.active_AllArticlesPage = true;
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
    }
    res.locals.article = await articleDao.retrieveArticlesByOrder(userId, req.query.sort);

    res.render("allArticles");

});

router.get("/addLikedArticles", showNotifications, async function(req, res) {
  
    res.locals.title = "All Articles";
    res.locals.active_AllArticlesPage = true;
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        await articleDao.insertLikedArticles(userId, req.query.likeAction);
    }
    const articleNumbers = await articleDao.retrieveArticleNumbers();
    res.locals.article = await articleDao.retrievePartialArticles(articleNumbers.count,userId);

    res.render("allArticles");

});

router.get("/removeLikedArticles", showNotifications, async function(req, res) {
  
    res.locals.title = "All Articles";
    res.locals.active_AllArticlesPage = true;
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        await articleDao.removeLikedArticles(userId, req.query.likeAction);
    }
    const articleNumbers = await articleDao.retrieveArticleNumbers();
    res.locals.article = await articleDao.retrievePartialArticles(articleNumbers.count,userId);

    res.render("allArticles");

});

module.exports = router;