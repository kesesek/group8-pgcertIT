const express = require("express");
const router = express.Router();

const showNotifications = require("../middleware/notifications-middleware.js");

const articleDao = require("../modules/article-dao.js");

router.get("/", showNotifications, async function(req, res) {
  
    res.locals.title = "All Articles";
    res.locals.article = await articleDao.retrievePartialArticles(6);

    res.render("home");

});

module.exports = router;