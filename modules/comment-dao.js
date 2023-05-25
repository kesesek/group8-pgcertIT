const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

// retrieve single comment by comment id
async function retrieveCommentById(commentId) {
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
                    // console.log(comment.id);
                }

                if (!findParent) {
                    // console.log("parent.children");
                    // console.log(parent.children);
                    // console.log(commentArray);
                    if (commentArray.length == 0) {
                        return nestedCommentArray;
                    }
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

// Export functions.
module.exports = {
    retrieveCommentsByArticleId,
    retrieveCommentById
};