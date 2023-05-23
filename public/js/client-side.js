window.addEventListener("load",function(){
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

    // add/remove favorites in the all articles page
    if(this.document.querySelector(".favorite")){
        const favoritebuttons = this.document.querySelectorAll(".favorite");
        const loginHint = document.querySelectorAll('.loginHint');
        for (let index = 0; index < favoritebuttons.length; index++) {
            const button = favoritebuttons[index];
            const singleHint = loginHint[index];
            button.addEventListener("click", function(){
                if (!getCookie("authToken")){
                    singleHint.classList.remove('hide');
                    singleHint.addEventListener("click", function(){
                        singleHint.classList.add('hide');
                    })
                }
            })
        }
    }
    
})