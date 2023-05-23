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

//get all user names from the database
async function getUsernames(){
    const db = await dbPromise;

    const userNames = await db.all(SQL`
        SELECT username FROM users
    `);

    return userNames;
}

//create a user then insert into the database
async function createUser(username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id){
    const db = await dbPromise;

    await db.run(SQL`
        INSERT INTO users (username, fname, mname, lname, description, date_of_birth, salt, iterations, hashed_password, icon_id) VALUES
        (${username}, ${fname}, ${mname}, ${lname}, ${description}, ${date_of_birth}, ${salt}, ${iterations}, ${hashed_password}, ${icon_id});
    `);
}

//get the predifined id of the icon
async function getPreIconId(filename){
    const db = await dbPromise;

    const preIconId = await db.get(SQL`
        SELECT id FROM icons
        WHERE filename = ${filename};
    `);

    return preIconId;
}

//save the uploaded Avatar filename into the database, then retrive the id of it
async function saveUploadAndGetId(filename){
    const db = await dbPromise;

    const result = await db.run(SQL`
        INSERT INTO icons (filename) VALUES (${filename});
    `);

    return result.lastID;
}

module.exports = {
    updateUser,
    retrieveUserWithCredentials,
    getUsernames,
    createUser,
    hashPassword,
    getPreIconId,
    saveUploadAndGetId
}