const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrieveNotificationByStatus(userAuthToken) {
    const db = await dbPromise;

    const notifications = await db.all(SQL`
        select * from notifications, users
        where notifications.isRead = 0
        and users.id = notifications.receiver_id
        and users.authToken = ${userAuthToken}`);
    
    return notifications;
}

async function retrieveIconByUserId(userId) {
    const db = await dbPromise;

    const iconPath = await db.get(SQL`
        select filename from icons, users
        where icons.id = users.icon_id
        and users.id = ${userId}`);
    
    return iconPath;
}

async function retrieveUsernameByUserId(userId) {
    const db = await dbPromise;

    const username = await db.get(SQL`
        select username from users
        where id = ${userId}`);
    
    return username;
}

async function retrieveAllNotificationWithauthTokenOrderByTimeAndRead(userAuthToken) {
    const db = await dbPromise;

    const allNotifications = await db.all(SQL`
        select n.id, n.date_time, n.isRead, n.message, n.comment_id, n.article_id, n.user_id, n.receiver_id
        from notifications as n, users as u
        where u.id = n.receiver_id
        and u.authToken = ${userAuthToken}
        order by n.isRead, n.date_time`);
    
    return allNotifications;
}

async function retrieveNotificationWithNotificationId(notificationId) {
    const db = await dbPromise;

    const notification = await db.get(SQL`
        select *
        from notifications
        where id = ${notificationId}`);
    
    return notification;
}

async function changeReadStatusWithNotificationId(notificationId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        update notifications
        set isRead = 1
        where id = ${notificationId}`);
    
}

// Export functions.
module.exports = {
    retrieveNotificationByStatus,
    retrieveIconByUserId,
    retrieveUsernameByUserId,
    retrieveAllNotificationWithauthTokenOrderByTimeAndRead,
    retrieveNotificationWithNotificationId,
    changeReadStatusWithNotificationId
};
