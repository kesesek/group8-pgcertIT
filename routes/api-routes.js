// user authentication 
const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

const userDao = require("../modules/user-dao.js");

router.post("/api/login", async function(req, res){
    const user = await userDao.retrieveUserWithCredentials(req.body.username, req.body.password);
    if (user) {
        const authToken = uuid();
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.status(204).json(authToken);
    } else{
        res.sendStatus(401);
    }
})

router.get("/api/logout", async function(req, res){
    res.clearCookie('authToken');
    res.sendStatus(204);
})

router.get("/api/users", async function(req, res){
    if (req.cookies.authToken) {
        const isAdmin = await userDao.checkUserAdmin(req.cookies.authToken);
        if (isAdmin) {
            const allUserProfiles = await userDao.retrieveAllUserProfilesAndArticles();
            res.json(allUserProfiles);
        } else{
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
})

router.delete("/api/users/:id", async function(req, res){
    if (req.cookies.authToken) {
        const isAdmin = await userDao.checkUserAdmin(req.cookies.authToken);
        if (isAdmin) {
            await userDao.delectUserById(req.params['id']);
            res.sendStatus(204);
        } else{
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;