const express = require("express");
const router = express.Router();

const showNotifications = require("../middleware/notifications-middleware.js");

router.get("/", showNotifications, async function(req, res) {

    res.locals.title = "All Articles";

    res.render("home");
});

module.exports = router;