// user authentication 
const {v4: uuid} = require("uuid");
const express = require("express");
const router = express.Router();


const userDao = require("../modules/user-dao.js");

router.get("/login", function(req, res) {
    if(res.locals.user) {
        res.redirect("/");
    } else {
        res.render("login");
    }
});

router.post("/login", async function(req, res) {
    const username = req.body.username_input;
    const password = req.body.password_input;

    const user = await userDao.retrieveUserWithCredentials(username, password);

    console.log(user);

    if(user) {
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

module.exports = router;
