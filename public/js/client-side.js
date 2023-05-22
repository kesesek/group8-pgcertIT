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

        // notificationBell.addEventListener("mouseover", function(){
        //     if(!notificationShowed){
        //         showNotification();
        //         notificationShowed = true;
        //     }
        // });

        // notificationBell.addEventListener("mouseout", function(){
        //     if(notificationShowed){
        //         hideNotification();
        //         notificationShowed = false;
        //     }
        // });

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
        console.log(loginLabel);
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
        console.log(favoritebuttons);
        favoritebuttons.forEach(button => {
            button.addEventListener("click", function(){
                button.innerHTML = `<img src="./images/black favorite.png" width="40px"></img>`;
            })
        });
    }
    
})