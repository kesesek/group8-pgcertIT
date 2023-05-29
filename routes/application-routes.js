const express = require("express");
const router = express.Router();

const showNotifications = require("../middleware/notifications-middleware.js");

const articleDao = require("../modules/article-dao.js");
const userDao = require("../modules/user-dao.js");
const commentDao = require("../modules/comment-dao.js");
const notificationDao = require("../modules/notification-dao.js");

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

    res.locals.article = await articleDao.retrieveArticleById(req.cookies.articleId);

    if (res.locals.article.imageId) {
        const imagePath = await articleDao.retrieveImageById(res.locals.article.imageId);
        res.locals.imagePath = imagePath.filename;
    }
    
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

    res.render("fullArticle");

});

router.post("/readFollower", showNotifications, async function(req, res) {
  
    res.locals.title = "Follower";

    // check if there has cookies notificationId? If yes, change notification table and clear the cookies
    if (req.cookies.notificationId) {
        await notificationDao.changeReadStatusWithNotificationId(req.cookies.notificationId);
        res.clearCookie("notificationId");
    }

    res.redirect("/follower");

});

router.post("/readNotification", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    // check if there has cookies notificationId? If yes, change notification table and clear the cookies
    let notification = null;
    if (req.cookies.notificationId) {
        await notificationDao.changeReadStatusWithNotificationId(req.cookies.notificationId);
        notification = await notificationDao.retrieveNotificationWithNotificationId(req.cookies.notificationId);
        res.clearCookie("notificationId");
    }

    if (notification.comment_id) {
        res.redirect("/article#comments");
    } else{
        res.redirect("/article");
    }

});

router.get("/notification/:notificationId", async function(req, res){
    const notifications = await notificationDao.retrieveNotificationWithNotificationId(req.params.notificationId);
    res.send(notifications);
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
        // reply comment to a comment
        await commentDao.addCommentToComment(req.query.comment, req.query.commentId, res.locals.article.articleId, userId);
        // insert new 'reply a comment' notifications to the notification table
        const followerArray = await userDao.retrieveFollowerByUserId(userId);
        const commentId = await commentDao.retrieveCommentIdByCommentArticleAndUser(req.query.comment, res.locals.article.articleId, userId);
        followerArray.forEach(async follower => {
            await notificationDao.addNotificationWithReplyComment(commentId.id, res.locals.article.articleId, userId, follower.id);
        });
    }else{
        res.locals.deleteNoAccess = "Please Log in to comment!";
        console.log(res.locals.deleteNoAccess);
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
        } else{
            res.locals.deleteNoAccess = "Sorry! You do not have access to delete this comment.";
        }
    } else {
        res.locals.deleteNoAccess = "Please Log in to delete!";
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

router.get("/commentArticle", showNotifications, async function(req, res) {
  
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
        await commentDao.addCommentToArticle(req.query.comment, res.locals.article.articleId, userId);
        // insert new 'make a comment' notifications to the notification table
        const followerArray = await userDao.retrieveFollowerByUserId(userId);
        const commentId = await commentDao.retrieveCommentIdByCommentArticleAndUser(req.query.comment, res.locals.article.articleId, userId);
        followerArray.forEach(async follower => {
            await notificationDao.addNotificationWithCommentToArticle(commentId.id, res.locals.article.articleId, userId, follower.id);
        });
    } else{
        res.locals.deleteNoAccess = "Please Log in to comment!";
    }

    res.render("fullArticle");

});

router.get("/unsubscribe", showNotifications, async function(req, res) {
  
    res.locals.title = "Full Article";

    res.locals.article = await articleDao.retrieveArticleById(req.query.subscribeOrNot);
    
    let userId = 0;
    if (req.cookies.authToken) {
        const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
        userId = user.id;
        await userDao.unsubscribeWithUserIdAndArticleId(userId, res.locals.article.authorId);
        await notificationDao.deleteNotificationWithNewSubscribe(userId, res.locals.article.authorId);
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
        await notificationDao.addNotificationWithNewSubscribe(userId, res.locals.article.authorId);
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