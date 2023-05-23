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

    if(!user) {
        return null;
    }

    const salt = user.salt;
    const iteration = parseInt(user.iterations);
    const hashedPassword = hashPassword(password, salt, iteration);
    if(hashedPassword == user.hashed_password) {
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

module.exports = {
    updateUser,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserIconPathWithAuthToken
}