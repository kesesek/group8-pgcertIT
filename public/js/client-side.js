window.addEventListener("load", async function(){
    if (document.querySelector(".notifications")) {
        const notificationBell = document.querySelector(".notifications");
        const notificationContainer = document.getElementById('notification-container');

        let notificationShowed = false;

        notificationBell.addEventListener("click", function(){
            if(notificationShowed){
                hideNotification();
                notificationShowed = false;
            } else{
                showNotification();
                notificationShowed = true;
            }
        });

        function showNotification(){
            notificationContainer.classList.remove('hide');
        };

        function hideNotification(){
            notificationContainer.classList.add('hide');
        };

        // change notifications status when it is clicked
        const notification = this.document.querySelectorAll(".notification-info");
        notification.forEach(message => {
            message.addEventListener("click", function(){
                message.classList.add('read');
            })
        });

        // change the login/logout label depends on the cookies
        const loginLabel = this.document.querySelector(".loginStatus");
        if (getCookie("authToken")) {
            loginLabel.innerHTML = `<a href="./" class="text logout">Log out</a>`;
            const logoutLabel = this.document.querySelector(".logout");
            logoutLabel.addEventListener("click", function(){
                deleteCookie("authToken");
            })
        } else {
            loginLabel.innerHTML = `<a href="./login" class="text">Log in</a>`;
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

        //function that check if the re-enter password is different from the first password
        passWordInput2.addEventListener("input", function () {
            passLabel.innerHTML = "";
            let passWordValue1 = passWordInput1.value;
            let passWordValue2 = passWordInput2.value;

            if(passWordValue1 != passWordValue2){
                passLabel.innerHTML = `Different password input!`;
            }
        });
    }

    // add/remove favorites in the all articles page
    if(this.document.querySelector(".favorite")){
        const favoritebuttons = this.document.querySelectorAll(".favorite");
        for (let index = 0; index < favoritebuttons.length; index++) {
            const button = favoritebuttons[index];
            button.addEventListener("click", function(){
                if (!getCookie("authToken")){
                    alert('Please Log in to add Favorites!');
                }
            })
        }
    }

    // subscribe/unsubscribe in the full articles page
    if(this.document.querySelector(".subscribeStatus")){
        const subscribebuttons = this.document.querySelector(".subscribeStatus");
        subscribebuttons.addEventListener("click", function(){
            if (!getCookie("authToken")){
                alert('Please Log in to subscribe!');
            }
        })
    };

    //hide or show comments of an article
    if (this.document.querySelector(".hide-or-show")) {
        const hideCommentButton = this.document.querySelector(".hideButton");
        const commentBlock = this.document.querySelector(".comments-block");
        const comments = await getNestedCommentsJson();
        const result = commentRecursion(comments);
        commentBlock.innerHTML = result;
        let commentHide = false;
        hideCommentButton.addEventListener("click", async function(){
            if (commentHide) {
                commentBlock.classList.remove('hide');
                hideCommentButton.innerHTML = 'Hide Comments';
                commentHide = false;
                const comments = await getNestedCommentsJson();
                const result = commentRecursion(comments);
                commentBlock.innerHTML = result;
            } else {
                commentBlock.classList.add('hide');
                hideCommentButton.innerHTML = 'Show Comments';
                commentHide = true;
                commentBlock.innerHTML = '';
            }
        });

        
        function commentRecursion(commentArray){
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
                <p class="comment-text">${comment.content}</p>
                <div class="button-combo">
                    <form action="./replyComment" method="get">
                        <div class="replyButton">
                            <button type="submit" name="replyComment" value=${comment.id}>Reply</button>
                        </div>
                    </form>
                    <form action="./deleteComment" method="get">
                        <div class="deleteButton">
                            <button type="submit" name="deleteComment" value=${comment.id}>Delete</button>
                        </div>
                    </form>
                </div>`;
                if (comment.children) {
                    const childrenArray = comment.children;
                    list += commentRecursion(childrenArray);
                }
                list += `
                </li>
                </ul>`;
            });
            // console.log(list);
            return list;
        }

        async function getNestedCommentsJson(){
            const articleId = getCookieValue("articleId");
            let commentsResponse = await fetch(`http://localhost:3000/comment/${articleId}`);
            let commentsJson = await commentsResponse.json();
            return commentsJson;
        };
    }

    // delete/reply comments
    if (this.document.querySelector(".deleteButton")) {
        const deleteButtonArray = this.document.querySelectorAll(".deleteButton");
        deleteButtonArray.forEach(deleteButton => {
            deleteButton.addEventListener("click", function () {
                if (!getCookie("authToken")){
                    alert('Please Log in to delete!');
                }
            })
        });

        const replyButtonArray = this.document.querySelectorAll(".replyButton");
        replyButtonArray.forEach(replyButton => {
            replyButton.addEventListener("click", function () {
                if (!getCookie("authToken")){
                    alert('Please Log in to reply!');
                }
            })
        });
    }
});


})

