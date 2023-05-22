const notificationDao = require("../modules/notification-dao.js");

async function showNotifications(req, res, next) {

    // show all notifications and count
    const notifications = await notificationDao.retrieveNotificationByStatus();
    res.locals.notificationCount = notifications.length;
    const notificationMessages = [];

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

    res.locals.notificationMessages = notificationMessages;

    next();
}

module.exports = showNotifications;