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



//for editAccount page⬇️--hly
//1.verify the new username:
console.log(document.querySelector("#newnameid"));
console.log('hey');
if (document.querySelector("#newnameid")) {
    //get all user names from the page we created, return the Json
    async function getAllUserNames() {
        let userNamesResponse = await fetch("http://localhost:3000/allusernames");
        let userNamesJson = await userNamesResponse.json();

        return userNamesJson;
    }

    //display the information about the duplicate usernames
    const testLabel = document.querySelector("#newNameTest");
    const userName = document.querySelector("#newnameid");
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
} else {
    console.log('no value');
}


//2.verify the new password:
if(document.querySelector("#confirmnewid")) {
    const isMatch = document.querySelector("#passwordMatch");
    const newPassword = document.querySelector("#newpasswordid");
    const confirmNew = document.querySelector("#confirmnewid");

    confirmNew.addEventListener("input", async function () {
        isMatch.innerHTML = "";
        let passWordValue1 = newPassword.value;
        let passWordValue2 = confirmNew.value;

        if(passWordValue1 != passWordValue2){
            isMatch.innerHTML = `Different password input!`;
        }
    });
}

//4.verify old password:
if(documrnt.querySelector("#oldpasswordid")) {
    console.log('im in');
    async function getVerificationResult(){
        let result = await fetch("http://localhost:3000/verifyOldPassword",{
            method:"POST",
            body: JSON.stringify({oldPassword:document.querySelector("#oldpasswordid").value}),
            headers: {
                "Content-Type": "application/json",
            },
        });
            let flag = await result.json();
            return flag;
    }

    const testLabel = document.querySelector("#oldPasswordTest");
        const oldone = document.querySelector("#oldpasswordid");
        console.log(oldone);

        oldone.addEventListener("input", async function () {
            testLabel.innerHTML = "";
            let oldpassword = oldone.value;
            console.log(oldpassword);

            const flag = await getVerificationResult();
                if (!flag) {
                    testLabel.innerHTML = `Verification failed!`;
                } else {
                    const newPasswordInput = document.querySelector("#newpasswordid");
                    newPasswordInput.disabled = false;

                    const confirmNewPssword = document.querySelector("#confirmnewid");
                    confirmNewPssword.disabled = false;

                }  
        });
}

//5.save changes:
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', function(){
    let avartarID = document.getElementById('nowAvatar').dataset.value;
    let avartarFileName = document.getElementById('nowAvatar').alt;
    let newName = document.getElementById('newnameid').value;
    let newPassword = document.getElementById('newpasswordid').value;
    let newDb = document.getElementById('newBd').value;
    let newFname = document.getElementById('fnameid').value;
    let newMname = document.getElementById('mnameid').value;
    let newLname = document.getElementById('lnameid').value;
    let newDes = document.getElementById('desid').value;
    $.ajax({
        url: "/saveAll",
        method:"POST",
        data: {
            avartarID: avartarID,
            avartarFileName: avartarFileName,
            newName: newName,
            newPassword: newPassword,
            newDb: newDb,
            newFname: newFname,
            newMname: newMname,
            newLname: newLname,
            newDes: newDes
        },
        success: function() {
            if(response.success) {
                alert("Saved!");
                setTimeout(function(){
                    window.location.href = "/editAccount";
                });
            } else {
                alert("Failed to save. Please try again.");
                setTimeout(function(){
                    window.location.href = "/editAccount";
                });
            }
            
        },
        error: function() {
            alert("Error. Failed to save. Please try again.");
            setTimeout(function(){
                window.location.href = "/editAccount";
            });
        }
    });
});

//6.delect account
document.getElementById('delectBtn').addEventListener('click', function(){
    $.ajax({
        url: "/delectAccount",
        method: "post",
        success:function(response) {
            if(response.success) {
                alert("Delected! Hope to see you again!");
                setTimeout(function(){
                    window.location.href = "/";
                });
            } else {
                alert("Failed to delete. Please try again.");
                setTimeout(function(){
                    window.location.href = "/";
                });
            }
        },
        error: function() {
            alert("Error. Failed to delete. Please try again.");
            setTimeout(function(){
                window.location.href = "/";
            });
        }
    });
});
})