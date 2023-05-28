const notificationDao = require("../modules/notification-dao.js");
const userDao = require("../modules/user-dao.js");

const commentDao = require("../modules/comment-dao.js");

async function showNotifications(req, res, next) {

    // show all notifications for the user and count
    const notificationMessages = [];
    if(req.cookies.authToken){
        res.locals.logout = false;
        const notifications = await notificationDao.retrieveNotificationByStatus(req.cookies.authToken);
        const icon = await userDao.retrieveUserIconPathWithAuthToken(req.cookies.authToken);
        res.locals.iconpath = icon.filepath;
        if (notifications.length > 0) {
            res.locals.notificationCount = notifications.length;
        }

        const allNotifications = await notificationDao.retrieveAllNotificationWithauthTokenOrderByTimeAndRead(req.cookies.authToken);
        if (allNotifications.length > 0) {
            for (let index = 0; index < allNotifications.length; index++) {
                const singleNotification = allNotifications[index];
                const id = singleNotification.id;
                const icon = await notificationDao.retrieveIconByUserId(singleNotification.user_id);
                const username = await notificationDao.retrieveUsernameByUserId(singleNotification.user_id);
                const message = singleNotification.message;
                const datestamp = singleNotification.date_time;

                let articleId = null;
                if (singleNotification.article_id){
                    articleId = singleNotification.article_id;
                }
                if (singleNotification.comment_id) {
                    articleId = await commentDao.retrieveArticleIdByCommentId(singleNotification.comment_id);
                    articleId = articleId.article_id;
                }

                let isRead = false;
                if (singleNotification.isRead == 1) {
                    isRead = true;
                }
    
                notificationMessages[index] = {
                    "id": id,
                    "icon": icon.filename,
                    "username": username.username,
                    "message": message,
                    "datastamp": datestamp,
                    "articleId": articleId,
                    "isread": isRead
                };
            }
        }
    } else{
        res.locals.iconpath = null;
        res.locals.logout = true;
    }
    
    res.locals.notificationMessages = notificationMessages;

    next();
}

module.exports = showNotifications;