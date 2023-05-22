const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrievePartialArticles(number) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        select a.title, a.content, a.date_time as datestamp, u.username as author from articles as a, users as u
        where u.id = a.author_id
        limit ${number}`);
    
    return articles;
}

// Export functions.
module.exports = {
    retrievePartialArticles
};