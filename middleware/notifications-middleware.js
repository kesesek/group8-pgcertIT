const notificationDao = require("../modules/notification-dao.js");

async function showNotifications(req, res, next) {

    // show all notifications for the user and count
    const notificationMessages = [];
    if(req.cookies.authToken){
        res.locals.logout = false;
        const notifications = await notificationDao.retrieveNotificationByStatus(req.cookies.authToken);
        if (notifications.length > 0) {
            res.locals.notificationCount = notifications.length;

            for (let index = 0; index < Math.min(10,notifications.length); index++) {
                const notification = notifications[index];
                const id = notification.id;
                const icon = await notificationDao.retrieveIconByUserId(notification.user_id);
                const username = await notificationDao.retrieveUsernameByUserId(notification.user_id);
                const message = notification.message;
                const datestamp = notification.date_time;
    
                notificationMessages[index] = {
                    "id": id,
                    "icon": icon.filename,
                    "username": username.username,
                    "message": message,
                    "datastamp": datestamp
                };
            }
        }
    } else{
        res.locals.logout = true;
    }
    
    res.locals.notificationMessages = notificationMessages;

    next();
}

module.exports = showNotifications;