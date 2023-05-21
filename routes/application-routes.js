const express = require("express");
const router = express.Router();

const notificationDao = require("../modules/notification-dao.js");

router.get("/", async function(req, res) {
  
    res.locals.title = "All Articles";

    // set up 
    const notifications = await notificationDao.retrieveNotificationByStatus();
    res.locals.notificationCount = notifications.length;


    res.render("home");

});

module.exports = router;