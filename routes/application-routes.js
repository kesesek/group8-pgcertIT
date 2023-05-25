const express = require("express");
const router = express.Router();

const showNotifications = require("../middleware/notifications-middleware.js");

const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");

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
    const articles = await articleDao.retrievePartialArticles(6, userId);
    articles.forEach(article => {
        article.content = article.content.substring(0,100) + "...";
    });
    res.locals.article = articles;

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
    const articles = await articleDao.retrievePartialArticles(articleNumbers.count,userId);
    articles.forEach(article => {
        article.content = article.content.substring(0,100) + "...";
    });
    res.locals.article = articles;

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
    const articles = await articleDao.retrieveArticlesByOrder(userId, req.query.sort);
    articles.forEach(article => {
        article.content = article.content.substring(0,100) + "...";
    });
    res.locals.article = articles;

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

    res.redirect("allArticles");

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

    res.redirect("allArticles");

});

router.get("/article", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.query.fullArticle);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        const subscribers = await userDao.retrieveSubscribeWithAuthorId(res.locals.article.authorId);
        subscribers.forEach(subscriber => {
            if (subscriber.subscribed_id == userId) {
                res.locals.subscribe = true;
            }
        });
    }
    res.cookie("articleId", req.query.fullArticle);
    // res.locals.comments = await commentDao.retrieveCommentsByArticleId(req.query.fullArticle);

    res.render("fullArticle");

});

router.get("/replyComment", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.cookies.articleId);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        const subscribers = await userDao.retrieveSubscribeWithAuthorId(res.locals.article.authorId);
        subscribers.forEach(subscriber => {
            if (subscriber.subscribed_id == userId) {
                res.locals.subscribe = true;
            }
        });
        // add comment to the comments table
    }

    res.render("fullArticle");

});

router.get("/deleteComment", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.cookies.articleId);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        const subscribers = await userDao.retrieveSubscribeWithAuthorId(res.locals.article.authorId);
        subscribers.forEach(subscriber => {
            if (subscriber.subscribed_id == userId) {
                res.locals.subscribe = true;
            }
        });
        const comment = await commentDao.retrieveCommentById(req.query.deleteComment);
        // delete comment and its children if have to the comments table
        res.cookie("commentId", comment.id);
        if (userId == comment.user_id || userId == res.locals.article.authorId) {
            await commentDao.deleteCommentById(comment.id);
        }
    }

    res.render("fullArticle");

});

router.get("/user/:authToken", async function(req, res){
    const user = await userDao.retrieveUserWithAuthToken(req.params.authToken);
    res.send(user);
});

router.get("/article/:articleId", async function(req, res){
    const article = await articleDao.retrieveArticleById(req.params.articleId);
    res.send(article);
});

router.get("/comment/:commentId", async function(req, res){
    const comment = await commentDao.retrieveCommentById(req.params.commentId);
    res.send(comment);
});

router.get("/articleComments/:articleId", async function(req, res){
    const comments = await commentDao.retrieveCommentsByArticleId(req.params.articleId);
    res.send(comments);
});

router.get("/unsubscribe", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.query.subscribeOrNot);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        await userDao.unsubscribeWithUserIdAndArticleId(userId, res.locals.article.authorId);
        const subscribers = await userDao.retrieveSubscribeWithAuthorId(res.locals.article.authorId);
        subscribers.forEach(subscriber => {
            if (subscriber.subscribed_id == userId) {
                res.locals.subscribe = true;
            }
        });
    }

    res.render("fullArticle");

});

router.get("/subscribe", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.query.subscribeOrNot);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        await userDao.subscribeWithUserIdAndArticleId(userId, res.locals.article.authorId);
        const subscribers = await userDao.retrieveSubscribeWithAuthorId(res.locals.article.authorId);
        subscribers.forEach(subscriber => {
            if (subscriber.subscribed_id == userId) {
                res.locals.subscribe = true;
            }
        });
    }

    res.render("fullArticle");

});

module.exports = router;