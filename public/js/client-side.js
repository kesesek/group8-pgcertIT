window.addEventListener("load", function () {
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

    notificationBell.addEventListener("mouseover", function () {
        if (!notificationShowed) {
            showNotification();
            notificationShowed = true;
        }
    });

    notificationBell.addEventListener("mouseout", function () {
        if (notificationShowed) {
            hideNotification();
            notificationShowed = false;
        }
    });

    function showNotification() {
        notificationContainer.classList.remove('hide');
    };

    function hideNotification() {
        notificationContainer.classList.add('hide');
    };

    async function getAllUserNames() {
        let userNamesResponse = await fetch("http://localhost:3000/allusernames");
        let userNamesJson = await userNamesResponse.json();

        return userNamesJson;
    }

    const testLabel = document.querySelector("#test");
    const userName = document.querySelector("#username");

    userName.addEventListener("input", async function () {
        testLabel.innerHTML = "";
        let userNameValue = userName.value;
        const userNamesArray = await getAllUserNames();
        for (let i = 0; i < userNamesArray.length; i++) {
            if (userNameValue == userNamesArray[i].username) {
                testLabel.innerHTML = `User name already exists!`;
                break;
            }
        }
    });

    const passLabel = document.querySelector("#pass");
    const passWordInput1 = document.querySelector("#password");
    const passWordInput2 = document.querySelector("#comPassword");

    passWordInput2.addEventListener("input", function () {
        passLabel.innerHTML = "";
        let passWordValue1 = passWordInput1.value;
        let passWordValue2 = passWordInput2.value;

        if(passWordValue1 != passWordValue2){
            passLabel.innerHTML = `Different password input!`;
        }
    });
})