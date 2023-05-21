const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrieveNotificationByStatus() {
    const db = await dbPromise;

    const notifications = await db.all(SQL`
        select * from notifications
        where isRead = 0`);
    
    return notifications;
}

// Export functions.
module.exports = {
    retrieveNotificationByStatus
};
