const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// retrieve single comment by comment id
async function retrieveCommentById(commentId) {
    const db = await dbPromise;

    const comment = await db.get(SQL`
        select *
        from comments
        where id = ${commentId}`);
    
    return comment;
}

// retrieve nested comments by article id
async function retrieveCommentsByArticleId(articleId) {
    const db = await dbPromise;

    const comments = await db.all(SQL`
        select c.id, c.content, c.date_time as timestamp, c.parent_id, c.article_id, i.filename, u.username
        from comments as c, users as u, icons as i
        where c.article_id = ${articleId}
        and c.user_id = u.id
        and u.icon_id = i.id`);
    
    const initialComments = turnNullParentToZero(comments);

    let nestedComments = [];
    const nestedCommentArray = [{id: 0, children: nestedComments}];
    
    const finalArray = makeNestedComments(initialComments, nestedCommentArray);
    
    return nestedCommentArray[0].children;
}

function makeNestedComments(commentArray, nestedCommentArray){

    if (commentArray.length == 0) {
        // return nestedCommentArray;
    } else{
        for (let i = 0; i < commentArray.length; i++) {
            let comment = commentArray[i];
            let findParent = false;
            // console.log(nestedCommentArray);
            nestedCommentArray.forEach(parent => {
                if (parent.id == comment.parent_id) {
                    if (!parent.children) {
                        parent["children"] = [];
                    }
                    parent["children"].push(comment);
                    commentArray.splice(i, 1);
                    i--;
                    findParent = true;
                    // console.log("findparent");
                    // console.log(comment);
                    // console.log("commentArray");
                    // console.log(commentArray);
                }

                // if (!findParent) {
                //     // console.log("parent.children");
                //     // console.log(parent.children);
                //     // console.log(commentArray);
                //     // if (commentArray.length == 0) {
                //     //     return nestedCommentArray;
                //     // }
                //     if (parent.children) {
                //         return makeNestedComments(commentArray, parent.children);
                //     }
                // }
            });

            // console.log("nestedCommentArray");
            // console.log(nestedCommentArray);
            
        }

        // last version
        if (commentArray.length != 0) {
            // console.log("nestedCommentArray");
            // console.log(nestedCommentArray);
            nestedCommentArray.forEach(parent => {
                // console.log("commentArray");
                // console.log(commentArray);
                // console.log("parent.children");
                // console.log(parent.children);
                if (parent.children) {
                    return makeNestedComments(commentArray, parent.children);
                }
            });
        }
    };
}

function turnNullParentToZero(commentArray){
    commentArray.forEach(comment => {
        let parent_id = 0;
        if (comment.parent_id) {
            parent_id = comment.parent_id;
        }
        comment.parent_id = parent_id;
    });

    return commentArray;
}

// delete comment and its children by comment id
async function deleteCommentById(commentId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    delete from comments
    where id = ${commentId}`);
}

// add new comment to article
async function addCommentToArticle(content, articleId, userId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO comments (content, date_time, parent_id, article_id, user_id) VALUES
	(${content}, datetime('now'), NULL, ${articleId}, ${userId})`);
}

// add new comment to a comment
async function addCommentToComment(content, parentId, articleId, userId){
    const db = await dbPromise;

    const result = await db.run(SQL`
    INSERT INTO comments (content, date_time, parent_id, article_id, user_id) VALUES
	(${content}, datetime('now'), ${parentId}, ${articleId}, ${userId})`);
}

async function retrieveArticleIdByCommentId(commentId) {
    const db = await dbPromise;

    const articleId = await db.get(SQL`
        select article_id 
        from comments
        where id = ${commentId}`);
    
    return articleId;
}

async function retrieveCommentIdByCommentArticleAndUser(comment, articleId, userId) {
    const db = await dbPromise;

    const commentIdArray = await db.all(SQL`
        select id 
        from comments
        where content = ${comment}
        and article_id = ${articleId}
        and user_id = ${userId}`);
    
    return commentIdArray[commentIdArray.length-1];
}

// Export functions.
module.exports = {
    retrieveCommentsByArticleId,
    retrieveCommentById,
    deleteCommentById,
    addCommentToArticle,
    addCommentToComment,
    retrieveArticleIdByCommentId,
    retrieveCommentIdByCommentArticleAndUser
};