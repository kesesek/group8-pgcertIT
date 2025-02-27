window.addEventListener("load", async function () {
    if (document.querySelector(".notifications")) {
        const notificationBell = document.querySelector(".notifications");
        const notificationContainer = document.getElementById('notification-container');

        let notificationShowed = false;

        notificationBell.addEventListener("click", function () {
            if (notificationShowed) {
                hideNotification();
                notificationShowed = false;
            } else {
                showNotification();
                notificationShowed = true;
            }
        });

        function showNotification() {
            notificationContainer.classList.remove('noDisplay');
        };

        function hideNotification() {
            notificationContainer.classList.add('noDisplay');
        };

        // change notifications status when it is clicked
        const notification = this.document.querySelectorAll(".notification-info");
        notification.forEach(message => {
            message.addEventListener("click", function () {
                message.classList.add('read');
            })
        });

        // turn to an article page from the notifications list
        if (this.document.querySelector(".notificationId")) {
            const notificationIdArray = this.document.querySelectorAll(".notificationId");
            notificationIdArray.forEach(notificationId => {
                notificationId.addEventListener("mouseover", async function () {
                    const notification = await getNotificationJson(notificationId.value);
                    setCookie("notificationId", notificationId.value, 1);
                    if (notification.article_id) {
                        setCookie("articleId", notification.article_id, 1);
                    }
                })
            });
        }

        async function getNotificationJson(notificationId) {
            let notificationResponse = await fetch(`/notification/${notificationId}`);
            let notificationJson = await notificationResponse.json();
            return notificationJson;
        };

        // change the login/logout label depends on the cookies
        const loginLabel = this.document.querySelector(".loginStatus");
        const or = this.document.querySelector(".or");
        const signupLabel = this.document.querySelector(".signupLabel");
        if (getCookie("authToken")) {
            loginLabel.innerHTML = `<a href="./" class="text logout">Log out</a>`;
            or.innerHTML = ``;
            signupLabel.innerHTML = ``;
            const logoutLabel = this.document.querySelector(".logout");
            logoutLabel.addEventListener("click", function () {
                deleteCookie("authToken");
                deleteCookie("toastMessage");
            })
        } else {
            loginLabel.innerHTML = `<a href="./login" class="text">Log in</a>`;
            or.innerHTML = `or`;
            signupLabel.innerHTML = `<a href="./signup" class="text">Sign up</a>`;
        }

        // check whether the user can go to their personal profile page(login or not)
        const navIcon = this.document.querySelector(".navIcon");

        navIcon.addEventListener("click", function () {
            if (!getCookie("authToken")) {
                // alert('Please Log in to go to your personal page!');
            }
        })
        if (document.querySelector(".closeProfileHint")) {
            const closeHint = document.querySelector(".closeProfileHint");
            closeHint.addEventListener("click", function () {
                const hint = document.querySelector("#noAccessProfileHint");
                hint.style.display = "none";
                deleteCookie("profileNoAccess");
                // setCookie("profileNoAccess", false, 1);
            });
        }
    }

    if (document.querySelector("#username")) {
        //get all user names from the page we created, return the Json
        async function getAllUserNames() {
            let userNamesResponse = await fetch("http://localhost:3000/allusernames");
            let userNamesJson = await userNamesResponse.json();

            return userNamesJson;
        }

        //display the information about the duplicate usernames
        const testLabel = document.querySelector("#test");
        const userName = document.querySelector("#username");
        console.log(userName);

        //function that check if there are duplicate usernames
        userName.addEventListener("input", async function () {
            testLabel.innerHTML = "";
            let userNameValue = userName.value;
            console.log(userNameValue);

            const userNamesArray = await getAllUserNames();
            for (let i = 0; i < userNamesArray.length; i++) {
                if (userNameValue == userNamesArray[i].username) {
                    testLabel.innerHTML = `User name already exists!`;
                    break;
                }
            }
        });

        //display the information about the different re-enter password
        const passLabel = document.querySelector("#pass");
        const passWordInput1 = document.querySelector("#password");
        const passWordInput2 = document.querySelector("#comPassword");


        //function that re-check if the first password is different from the second password
        passWordInput1.addEventListener("input", function () {
            passLabel.innerHTML = "";
            let passWordValue1 = passWordInput1.value;
            let passWordValue2 = passWordInput2.value;
            if ((passWordValue1 != passWordValue2) && (passWordValue2 != "")) {
                passLabel.innerHTML = `Different password input!`;
            }
        });

        //function that check if the re-enter password is different from the first password
        passWordInput2.addEventListener("input", function () {
            passLabel.innerHTML = "";
            let passWordValue1 = passWordInput1.value;
            let passWordValue2 = passWordInput2.value;
            if (passWordValue1 != passWordValue2) {
                passLabel.innerHTML = `Different password input!`;
            }
        });
    }

    // add articleId cookies when the read more button was clicked in the all articles page
    if (this.document.querySelector(".readMore")) {
        const readMoreButtons = this.document.querySelectorAll(".readMore");
        readMoreButtons.forEach(readMore => {
            readMore.addEventListener("click", function () {
                setCookie("articleId", readMore.value, 1)
            })
        });
    }

    // add/remove favorites in the all articles page
    if (this.document.querySelector(".favorite")) {
        const favoritebuttons = this.document.querySelectorAll(".favorite");
        for (let index = 0; index < favoritebuttons.length; index++) {
            const button = favoritebuttons[index];

            button.addEventListener("click", function () {
                if (!getCookie("authToken")) {
                    // alert('Please Log in to add Favorites!');
                }
            })
        }
    }

    if (document.querySelector(".closeLikeHint")) {
        const closeHint = document.querySelector(".closeLikeHint");
        closeHint.addEventListener("click", function () {
            const hint = document.querySelector("#noAccessLikeHint");
            hint.style.display = "none";
            // setCookie("likeNoAccess", false, 1);
            deleteCookie("likeNoAccess");
        });
    }

    // subscribe/unsubscribe in the full articles page
    if (this.document.querySelector(".subscribeStatus")) {
        const subscribebuttons = this.document.querySelector(".subscribeStatus");

        subscribebuttons.addEventListener("click", function () {
            if (!getCookie("authToken")) {
                // alert('Please Log in to subscribe!');
            }
        })
    };
    if (document.querySelector(".closeSubscribeHint")) {
        const closeHint = document.querySelector(".closeSubscribeHint");
        closeHint.addEventListener("click", function () {
            const hint = document.querySelector("#noAccessSubscribeHint");
            hint.style.display = "none";
            // setCookie("subscribeNoAccess", false, 1);
            deleteCookie("subscribeNoAccess");
        });
    }
    if (document.querySelector(".closesubscribeYourselfHint")) {
        const closeHint = document.querySelector(".closesubscribeYourselfHint");
        closeHint.addEventListener("click", function () {
            const hint = document.querySelector("#subscribeYourselfHint");
            hint.style.display = "none";
            // setCookie("subscribeNoAccess", false, 1);
            deleteCookie("subscribeYourself");
        });
    }

    //hide or show comments of an article
    if (this.document.querySelector(".hide-or-show")) {
        const hideCommentButton = this.document.querySelector(".hideButton");
        const commentBlock = this.document.querySelector(".comments-block");
        const comments = await getNestedCommentsJson();
        if (comments.length == 0) {
            commentBlock.innerHTML = `<p>No comments yet.</p>`
        } else {
            const result = commentRecursion(comments);
            commentBlock.innerHTML = result;
        }
        let commentHide = false;
        hideCommentButton.addEventListener("click", async function () {
            if (commentHide) {
                commentBlock.classList.remove('hide');
                hideCommentButton.innerHTML = 'Hide Comments';
                commentHide = false;
                const comments = await getNestedCommentsJson();
                if (comments.length == 0) {
                    commentBlock.innerHTML = `<p>No comments yet.</p>`
                } else {
                    const result = commentRecursion(comments);
                    commentBlock.innerHTML = result;
                }
            } else {
                commentBlock.classList.add('hide');
                hideCommentButton.innerHTML = 'Show Comments';
                commentHide = true;
                commentBlock.innerHTML = '';
            }
        });


        function commentRecursion(commentArray) {
            let list = ``;
            list += `<ul>`;
            commentArray.forEach(comment => {
                list += `
                <li>
                <div class="comment-header">
                    <img src="./images/icons/${comment.filename}" width="40px">
                    <p>${comment.username}</p>
                    <p>${comment.timestamp}</p>
                </div>
                <p class="comment-text" id="${comment.id}">${comment.content}</p>
                <div class="button-combo">
                    <div class="replyButton">
                        <button name="replyComment" class="replyComment" value=${comment.id}>Reply</button>
                    </div>
                    <form action="./deleteComment" method="get">
                        <div class="deleteButton">
                            <button type="submit" name="deleteComment" class="deleteComment" value=${comment.id}>Delete</button>
                        </div>
                    </form>
                </div>
                <div class="replyText">
                </div>`;
                if (comment.children) {
                    const childrenArray = comment.children;
                    list += commentRecursion(childrenArray);
                }
                list += `
                </li>`;
            });
            list += `</ul>`;
            return list;
        }

        async function getNestedCommentsJson() {
            const articleId = getCookieValue("articleId");
            let commentsResponse = await fetch(`/articleComments/${articleId}`);
            let commentsJson = await commentsResponse.json();
            return commentsJson;
        };
    }

    // delete/reply comments
    if (this.document.querySelector(".deleteButton")) {
        // if (this.document.querySelector(".hint-message")) {
        //     const deleteFail = this.document.querySelector(".hint-message");
        //     deleteFail.addEventListener("click", function(){
        //         deleteFail.innerHTML = '';
        //     })
        // }
        const deleteButtonArray = this.document.querySelectorAll(".deleteButton");
        const submitDeleteButtonArray = this.document.querySelectorAll(".deleteComment");
        for (let index = 0; index < deleteButtonArray.length; index++) {
            const deleteButton = deleteButtonArray[index];
            deleteButton.addEventListener("mouseover", async function () {
                // console.log(submitDeleteButtonArray[index].value);
                setCookie("commentId", submitDeleteButtonArray[index].value, 1);
            })
            deleteButton.addEventListener("click", async function () {

                if (!getCookie("authToken")) {
                    // alert('Please Log in to delete!');
                    // const hint = document.querySelector("#noAccessDeleteHint");
                    // hint.style.display = "block";
                } else {
                    const comment = await getCommentJson();
                    const article = await getArticleJson();
                    const user = await getUserJson();
                    console.log(getCookie("authToken"));
                    console.log(getCookie("authToken"));
                    console.log(comment.user_id);
                    console.log(article.authorId);
                    console.log(user.id);
                    if (user.id != article.authorId && user.id != comment.user_id) {
                        // alert('Sorry! You do not have access to delete this comment.');
                    }
                }
            })
        };
        if (document.querySelector(".closeNoLoginDeleteHint")) {
            const closeHint = document.querySelector(".closeNoLoginDeleteHint");
            closeHint.addEventListener("click", function () {
                const hint = document.querySelector("#noLoginDeleteHint");
                hint.style.display = "none";
                // setCookie("deleteNoLogin", false, 1);
                deleteCookie("deleteNoLogin");
            });
        }
        if (document.querySelector(".closeNoAccessDeleteHint")) {
            const closeHint = document.querySelector(".closeNoAccessDeleteHint");
            closeHint.addEventListener("click", function () {
                const hint = document.querySelector("#noAccessDeleteHint");
                hint.style.display = "none";
                // setCookie("deleteNoAccess", false, 1);
                deleteCookie("deleteNoAccess");
            });
        }

        const replyButtonArray = this.document.querySelectorAll(".replyButton");
        const replyTextArray = this.document.querySelectorAll(".replyText");
        const replyCommentArray = this.document.querySelectorAll(".replyComment");
        // const replyCommentHint = this.document.querySelector(".hint-message");
        for (let index = 0; index < replyButtonArray.length; index++) {
            const replyButton = replyButtonArray[index];
            let replyDisplay = false;
            replyButton.addEventListener("click", function () {
                const replyText = replyTextArray[index];
                const replyComment = replyCommentArray[index];

                if (!getCookie("authToken")) {
                    // alert('Please Log in to reply!');
                    const hint = document.querySelector("#noAccessReplyHint");
                    hint.style.display = "block";
                    // replyCommentHint.innerHTML = "Please Log in to reply a comment!";
                    // window. scrollTo(0, 0);
                } else {
                    if (!replyDisplay) {
                        replyText.innerHTML = `
                        <div id="commentEditor" style="width: 82.5%;">
                            <form action="./replyComment" method="get">
                                <textarea name="comment" class="commentContent" placeholder="Any comments?" rows="4" style="width: 100%; max-width: 100%;" required></textarea><br>
                                <button type="submit" id="commentButton" name="commentId" value=${replyComment.value}>Submit</button>
                            </form>
                        </div>`;
                        replyDisplay = true;
                    } else {
                        replyText.innerHTML = '';
                        replyDisplay = false;
                    }
                }
            })
        };

        const commentButton = this.document.querySelector("#commentButton");
        // const replyArticleHint = this.document.querySelector(".hint-message");
        commentButton.addEventListener("click", async function () {

            if (!getCookie("authToken")) {
                // alert('Please Log in to comment!');
                // const hint = document.querySelector("#noAccessCommentHint");
                // hint.style.display = "block";
                // replyArticleHint.innerHTML = "Please Log in to reply the article!";
                // window. scrollTo(0, 0);
            }
        });
        if (document.querySelector(".closeCommentHint")) {
            const closeHint = document.querySelector(".closeCommentHint");
            closeHint.addEventListener("click", function () {
                const hint = document.querySelector("#noAccessCommentHint");
                hint.style.display = "none";
                // setCookie("commentNoAccess", false, 1);
                deleteCookie("commentNoAccess");
            });
        }

        // To check whether the user has the access to delete the comment
        // So that we can alert the user or not 
        async function getUserJson() {
            const authToken = getCookieValue("authToken");
            let userResponse = await fetch(`http://localhost:3000/user/${authToken}`);
            let userJson = await userResponse.json();
            return userJson;
        };

        async function getCommentJson() {
            const commentId = getCookieValue("commentId");
            let commentResponse = await fetch(`http://localhost:3000/comment/${commentId}`);
            let commentJson = await commentResponse.json();
            return commentJson;
        };

        async function getArticleJson() {
            const articleId = getCookieValue("articleId");
            let articleResponse = await fetch(`http://localhost:3000/article/${articleId}`);
            let articleJson = await articleResponse.json();
            return articleJson;
        };
        // check alert end
    }

    //when upload image in the addarticle page, the message will display since the image uploaded successfully
    if (this.document.querySelector("#inpFile")) {
        const inputBtn = document.querySelector("#inpFile");
        const successSpan = document.querySelector("#success");
        inputBtn.addEventListener("change", function () {
            successSpan.innerHTML = `Upload successfully!`;
        });
    }

    // edit Account page
    if (document.querySelector(".closeSaveHint")) {
        const closeHint = document.querySelector(".closeSaveHint");
        closeHint.addEventListener("click", function () {
            const hint = document.querySelector("#saveSuccess");
            hint.style.display = "none";
            // setCookie("saveSuccess", false, 1);
            deleteCookie("saveSuccess");
        });
    }

    //delete the image uploaded in the addarticle page
    if (document.querySelector("#delBtn")) {
        const delBtn = document.querySelector("#delBtn");
        const imageDisplay = document.querySelector("#imageDisplay");

        delBtn.addEventListener("click", function () {
            imageDisplay.innerHTML = "";
            delBtn.value = "Deleted successfully!";
            setCookie("delImage", true, 1);
        });
        // if (delBtn.value == "Deleted successfully!") {
        //     setCookie("delImage", true, 1);
        // }
    }
});

