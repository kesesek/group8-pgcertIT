const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrievePartialArticles(number,userId) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        SELECT f.id, f.title, f.content, f.datestamp, f.author, s.user_id
        FROM (select a.id, a.title, a.content, a.date_time as datestamp, u.username as author
                from articles as a, users as u
                where u.id = a.author_id) as f
        LEFT JOIN
            (SELECT likes.user_id, likes.article_id
                FROM likes, users
                WHERE users.id = likes.user_id
                and users.id = ${userId}) as s
        on f.id = s.article_id
        limit ${number}`);
    
    return articles;
}

async function retrieveArticleNumbers() {
    const db = await dbPromise;

    const articlesNumber = await db.get(SQL`
        select count(id) as count from articles`);
    
    return articlesNumber;
}

async function retrieveArticlesByOrder(userId, sortOption) {
    const db = await dbPromise;
    let articles = null;

    if (sortOption == "title") {
        articles = await db.all(SQL`
        SELECT f.id, f.title, f.content, f.datestamp, f.author, s.user_id
        FROM (select a.id, a.title, a.content, a.date_time as datestamp, u.username as author
                from articles as a, users as u
                where u.id = a.author_id) as f
        LEFT JOIN
            (SELECT likes.user_id, likes.article_id
                FROM likes, users
                WHERE users.id = likes.user_id
                and users.id = ${userId}) as s
        on f.id = s.article_id
        order by title`);
    }
    if (sortOption == "author") {
        articles = await db.all(SQL`
        SELECT f.id, f.title, f.content, f.datestamp, f.author, s.user_id
        FROM (select a.id, a.title, a.content, a.date_time as datestamp, u.username as author
                from articles as a, users as u
                where u.id = a.author_id) as f
        LEFT JOIN
            (SELECT likes.user_id, likes.article_id
                FROM likes, users
                WHERE users.id = likes.user_id
                and users.id = ${userId}) as s
        on f.id = s.article_id
        order by author`);
    }
    if (sortOption == "datestamp") {
        articles = await db.all(SQL`
        SELECT f.id, f.title, f.content, f.datestamp, f.author, s.user_id
        FROM (select a.id, a.title, a.content, a.date_time as datestamp, u.username as author
                from articles as a, users as u
                where u.id = a.author_id) as f
        LEFT JOIN
            (SELECT likes.user_id, likes.article_id
                FROM likes, users
                WHERE users.id = likes.user_id
                and users.id = ${userId}) as s
        on f.id = s.article_id
        order by datestamp`);
    }
    
    return articles;
}

async function insertLikedArticles(userId, articleId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO likes (user_id, article_id) VALUES
	(${userId}, ${articleId})`);
    
}

async function removeLikedArticles(userId, articleId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
    delete from likes
    where user_id = ${userId}
    and article_id = ${articleId}`);
    
}

async function retrieveArticleById(articleId) {
    const db = await dbPromise;

    const article = await db.get(SQL`
        select a.id as articleId, a.title, a.date_time as timestamp, i.filename as path, a.content, a.author_id as authorId
        from articles as a, users as u, icons as i
        where a.id = ${articleId}
        and a.author_id = u.id
        and i.id = u.icon_id`);
    
    return article;
}


// Export functions.
module.exports = {
    retrievePartialArticles,
    retrieveArticleNumbers,
    retrieveArticlesByOrder,
    insertLikedArticles,
    removeLikedArticles,
    retrieveArticleById
};