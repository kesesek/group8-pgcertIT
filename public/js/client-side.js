window.addEventListener("load",function(){
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
})