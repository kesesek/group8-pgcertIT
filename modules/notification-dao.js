const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrieveNotificationByStatus() {
    const db = await dbPromise;

    const notifications = await db.all(SQL`
        select * from notifications
        where isRead = 0`);
    
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

// Export functions.
module.exports = {
    retrieveNotificationByStatus,
    retrieveIconByUserId,
    retrieveUsernameByUserId
};
