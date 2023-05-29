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

// add new notification to the notification table when comment to article
async function addNotificationWithCommentToArticle(commentId, articleId, userId, receiverId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO notifications (date_time, isRead, message, comment_id, article_id, user_id, receiver_id) VALUES
	(datetime('now'), 0, 'made a comment', ${commentId},${articleId}, ${userId}, ${receiverId})`);
}

// add new notification to the notification table when reply a comment
async function addNotificationWithReplyComment(commentId, articleId, userId, receiverId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO notifications (date_time, isRead, message, comment_id, article_id, user_id, receiver_id) VALUES
	(datetime('now'), 0, 'replied a comment', ${commentId},${articleId}, ${userId}, ${receiverId})`);
}

// add new notification to the notification table when subscribe a blogger
async function addNotificationWithNewSubscribe(userId, receiverId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO notifications (date_time, isRead, message, user_id, receiver_id) VALUES
	(datetime('now'), 0, 'started following you', ${userId}, ${receiverId})`);
}

// delete new notification to the notification table when subscribe a blogger
async function deleteNotificationWithNewSubscribe(userId, receiverId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    delete from notifications 
    where message = 'started following you' 
    and user_id = ${userId}
    and receiver_id = ${receiverId}`);
}

// add new notification to the notification table when publishing new article
async function addNotificationWithNewArticle(articleId, userId, receiverId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO notifications (date_time, isRead, message, article_id, user_id, receiver_id) VALUES
	(datetime('now'), 0, 'published an article', ${articleId}, ${userId}, ${receiverId})`);
}

// Export functions.
module.exports = {
    retrieveNotificationByStatus,
    retrieveIconByUserId,
    retrieveUsernameByUserId,
    retrieveAllNotificationWithauthTokenOrderByTimeAndRead,
    retrieveNotificationWithNotificationId,
    changeReadStatusWithNotificationId,
    addNotificationWithCommentToArticle,
    addNotificationWithReplyComment,
    addNotificationWithNewSubscribe,
    deleteNotificationWithNewSubscribe,
    addNotificationWithNewArticle
};
