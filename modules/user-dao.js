const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//login⬇️--HLY
const crypto = require("crypto");

async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;
    const user = await db.get(SQL`
    select * from users
    where username = ${username} 
    `);

    if (!user) {
        return null;
    }

    const salt = user.salt;
    const iteration = parseInt(user.iterations);
    const hashedPassword = hashPassword(password, salt, iteration);
    if (hashedPassword == user.hashed_password) {
        return user;
    } else {
        return null;
    }
}

function hashPassword(password, salt, iteration) {
    const length = 256;
    const digest = 'sha512';

    const hashedPassword = crypto.pbkdf2Sync(
        password, salt, iteration, length, digest);

    return hashedPassword.toString('hex');
}
//login⬆️

//update the user's info⬇️
async function updateUser(user) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set username = ${user.username}, hashed_password = ${user.hashed_password},
        authToken = ${user.authToken}
        where id = ${user.id}`);
}

async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;
    const user = await db.get(SQL`
    select * from users
    where authToken = ${authToken} 
    `);

    return user;
}

async function retrieveUserIconPathWithAuthToken(authToken) {
    const db = await dbPromise;
    const user = await db.get(SQL`
    select icons.filename as filepath from icons, users
    where users.authToken = ${authToken} 
    and users.icon_id = icons.id`);

    return user;
}

//get all user names from the database
async function getUsernames() {
    const db = await dbPromise;

    const userNames = await db.all(SQL`
        SELECT username FROM users
    `);

    return userNames;
}

//create a user then insert into the database
async function createUser(username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id) {
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO users (username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id) VALUES
        (${username}, ${fname}, ${mname}, ${lname}, ${description}, ${date_of_birth}, ${salt}, ${iterations}, ${hashed_password}, ${icon_id});
    `);
}

//get the predifined id of the icon
async function getPreIconId(filename) {
    const db = await dbPromise;

    const preIconId = await db.get(SQL`
        SELECT id FROM icons
        WHERE filename = ${filename};
    `);

    return preIconId;
}

//save the uploaded Avatar filename into the database, then retrive the id of it
async function saveUploadAndGetId(filename) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        INSERT INTO icons (filename) VALUES (${filename});
    `);

    return result.lastID;
}

//get the subscribe status by subscriber id and blogger id
async function retrieveSubscribeWithAuthorId(authorId) {
    const db = await dbPromise;

    const subscribers = await db.all(SQL`
        SELECT subscribed_id FROM subscribles
        WHERE blogger_id = ${authorId};
    `);

    return subscribers;
}

//unsubscribe by subscriber id and blogger id
async function unsubscribeWithUserIdAndArticleId(userId, articleId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
    delete from subscribles
    where subscribed_id = ${userId}
    and blogger_id = ${articleId}`);

}

//subscribe by subscriber id and blogger id
async function subscribeWithUserIdAndArticleId(userId, articleId) {
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO subscribles (subscribed_id, blogger_id) VALUES
	(${userId}, ${articleId})`);
}


//for editAccount page ⬇️
//1.get user's info
async function getUserInfo(authToken) {
    const db = await dbPromise;
    const user = await db.get(SQL`
    select * from users
    where authToken = ${authToken}`);
    return user;
}
//2.get all avatars
async function getAvatars() {
    const db = await dbPromise;
    const images = await db.all(SQL`
    select id, filename from icons`);
    return images;
}
//3.get user's avatar
async function getUserAvatar(userId) {
    const db = await dbPromise;
    const iconPath = await db.get(SQL`
        select filename from icons, users
        where icons.id = users.icon_id
        and users.id = ${userId}`);

    return iconPath;
}

//5.update info
async function updateUserAvatar(authToken, avartarID) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set icon_id = ${avartarID}
        where authToken = ${authToken}`);
}

async function updateUsername(authToken, name) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set username = ${name}
        where authToken = ${authToken}`);
}

async function updatePassword(authToken, salt, iteration, password) {
    const db = await dbPromise;

    const hashedPassword = hashPassword(password, salt, iteration);
    await db.run(SQL`
        update users
        set hashed_password = ${hashedPassword}
        where authToken = ${authToken}`);
}

async function updateDescription(authToken, description) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set description = ${description}
        where authToken = ${authToken}`);
}

async function updateFname(authToken, fname) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set fname = ${fname}
        where authToken = ${authToken}`);
}

async function updateMname(authToken, mname) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set mname = ${mname}
        where authToken = ${authToken}`);
}

async function updateLname(authToken, lname) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set lname = ${lname}
        where authToken = ${authToken}`);
}

async function updateDateBrith(authToken, date) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set date_of_birth = ${date}
        where authToken = ${authToken}`);
}

//6.delect an account
async function delectAccount(authToken) {
    const db = await dbPromise;

    await db.run(SQL`
        DELETE FROM users
        WHERE authToken = ${authToken}`);

}
//editAccount page ends

//retrieve user's id by authToken
async function retrieveUserIdWithAuthToken(authToken) {
    const db = await dbPromise;

    const user_id = await db.get(SQL`
        SELECT id FROM users
        WHERE authToken = ${authToken}`);

    return user_id;
}

//save the uploaded article's image filename into the database, then retrive the id of it
async function saveImageAndGetId(filename) {
    const db = await dbPromise;

    const result = await db.run(SQL`
        INSERT INTO images (filename) VALUES (${filename});
    `);

    return result.lastID;
}

//add new article to the database, including an image if exists
async function addArticle(content, title, user_id, image_id) {
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO articles (content, title, date_time, author_id, image_id)
        VALUES (${content}, ${title}, datetime('now'), ${user_id}, ${image_id})
    `);
}

//retrieve the liked articles by the user_id
async function retrieveLikedArticlesByUserId(user_id) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        SELECT articles.id, articles.content, articles.title, articles.date_time, 
        articles.author_id, articles.image_id, users.username AS authorname, users.id AS author_id
        FROM articles
        JOIN users ON articles.author_id = users.id
        WHERE articles.id IN (
        SELECT likes.article_id
        FROM likes
        WHERE likes.user_id = ${user_id}
        );
    `);

    return articles;
}

//retrieve following object by user_id
async function retrieveFollowingByUserId(user_id) {
    const db = await dbPromise;

    const following = await db.all(SQL`
        SELECT u.id, u.username, i.filename
        FROM users u
        JOIN icons i ON u.icon_id = i.id
        WHERE u.id IN (
        SELECT blogger_id
        FROM subscribles
        WHERE subscribed_id = ${user_id});    
    `);

    return following;
}

//retrieve follower object by user_id
async function retrieveFollowerByUserId(user_id) {
    const db = await dbPromise;

    const follower = await db.all(SQL`
        SELECT u.id, u.username, i.filename
        FROM users u
        JOIN icons i ON u.icon_id = i.id
        WHERE u.id IN (
        SELECT subscribed_id
        FROM subscribles
        WHERE blogger_id = ${user_id});
    `);

    return follower;
}

//retrieve target user's all articles
async function retrieveUserArticlesByTargetId(targetId) {
    const db = await dbPromise;

    const articles = await db.all(SQL`
        SELECT articles.id, articles.content, articles.title, articles.date_time, 
        articles.author_id, articles.image_id, users.username AS authorname
        FROM articles
        JOIN users ON articles.author_id = users.id
        WHERE articles.author_id = ${targetId}
        ORDER BY articles.date_time DESC;
    `);

    return articles;
}

//retrieve the liked article Ids by the user_id
async function retrieveLikedArticleIdsByUserId(user_id) {
    const db = await dbPromise;

    const articleIds = await db.all(SQL`
        SELECT likes.article_id
        FROM likes
        WHERE likes.user_id = ${user_id};
    `);

    return articleIds;
}

//retrieve author by article id
async function retrieveAuthorIdByArticleId(article_id) {
    const db = await dbPromise;

    const author_id = await db.get(SQL`
        SELECT author_id FROM articles
        WHERE id = ${article_id};
    `);

    return author_id;
}

//delete an article by article_id
async function deleteArticleById(article_id) {
    const db = await dbPromise;

    await db.run(SQL`
        DELETE FROM articles
        WHERE id = ${article_id};    
    `);
}

//retrieve an article information by article id
async function getArticleById(article_id) {
    const db = await dbPromise;

    const article = await db.get(SQL`
        SELECT * FROM articles
        WHERE id = ${article_id};
    `);

    return article;
}

//update article information by article id
async function updateArticleById(article_id, content, title, image_id) {
    const db = await dbPromise;

    await db.run(SQL`
        UPDATE articles
        SET content = ${content}, title = ${title}, image_id = ${image_id}
        WHERE id = ${article_id};    
    `);
}

module.exports = {
    updateUser,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserIconPathWithAuthToken,
    getUsernames,
    createUser,
    hashPassword,
    getPreIconId,
    saveUploadAndGetId,
    retrieveSubscribeWithAuthorId,
    unsubscribeWithUserIdAndArticleId,
    subscribeWithUserIdAndArticleId,
    getUserInfo,
    getAvatars,
    getUserAvatar,
    updateUserAvatar,
    updateUsername,
    updatePassword,
    updateDescription,
    updateFname,
    updateMname,
    updateLname,
    updateDateBrith,
    delectAccount,
    retrieveUserIdWithAuthToken,
    saveImageAndGetId,
    addArticle,
    retrieveLikedArticlesByUserId,
    retrieveFollowingByUserId,
    retrieveFollowerByUserId,
    retrieveUserArticlesByTargetId,
    retrieveLikedArticleIdsByUserId,
    retrieveAuthorIdByArticleId,
    deleteArticleById,
    getArticleById,
    updateArticleById
}