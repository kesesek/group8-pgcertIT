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
    retrieveUserIdWithAuthToken,
    saveImageAndGetId,
    addArticle,
    retrieveLikedArticlesByUserId
}