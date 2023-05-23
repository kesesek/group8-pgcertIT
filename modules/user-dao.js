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

async function getUsernames(){
    const db = await dbPromise;

    const userNames = await db.all(SQL`
        SELECT username FROM users
    `);

    return userNames;
}

async function createUser(username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id){
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO users (username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id) VALUES
        (${username}, ${fname}, ${mname}, ${lname}, ${description}, ${date_of_birth}, ${salt}, ${iterations}, ${hashed_password}, ${icon_id});
    `);
}

async function getPreIconId(filename){
    const db = await dbPromise;

    const preIconId = await db.get(SQL`
        SELECT id FROM icons
        WHERE filename = ${filename};
    `);

    return preIconId;
}

async function saveUploadAndGetId(filename){
    const db = await dbPromise;

    const result = await db.run(SQL`
        INSERT INTO icons (filename) VALUES (${filename});
    `);

    return result.lastID;
}

//for editAccount page ⬇️
//1.get user's info
async function getUserInfo(authToken) {
    const db = await dbPromise;
    const user = await db.run(SQL`
    select * from users
    where authToken = ${authToken}`);
    return user;
}
//2.get all avatars
async function getAvatars(){
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
//4.pic exists or not
async function isExist(filename) {
    const db = await dbPromise;
    const query = 'select count(*) as count from icons where filename = ?';
    const params = [filename];
    const result = await db.get(query, params);

    const count = result.count;
    if(count > 0) {
        return true;
    } else {
        return false;
    }
}
//4.update info
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

async function updatePassword(authToken, password) {
    const db = await dbPromise;
    const user = await db.run(SQL`
    select * from users
    where authToken = ${authToken} `);

    const hashedPassword = hashPassword(password, user.salt, paseInt(user.iterations));
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
//editAccount page ends

module.exports = {
    updateUser,
    retrieveUserWithCredentials,
    getUsernames,
    createUser,
    hashPassword,
    getPreIconId,
    saveUploadAndGetId,
    getUserInfo,
    getAvatars,
    getUserAvatar,
    isExist,
    updateUserAvatar,
    updateUsername,
    updatePassword,
    updateDescription,
    updateFname,
    updateMname,
    updateLname,
    updateDateBrith
}