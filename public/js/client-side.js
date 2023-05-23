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

    //get all user names from the page we created, return the Json
    async function getAllUserNames() {
        let userNamesResponse = await fetch("http://localhost:3000/allusernames");
        let userNamesJson = await userNamesResponse.json();

        return userNamesJson;
    }

    //display the information about the duplicate usernames
    const testLabel = document.querySelector("#test");
    const userName = document.querySelector("#username");

    //function that check if there are duplicate usernames
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

//for editAccount page⬇️--hly
//1.verify the new username:
const testNewName = document.querySelector("#newNameTest");
    const newName = document.querySelector("#newnameid");

    newName.addEventListener("input", async function () {
        testNewName.innerHTML = "";
        let newNameValue = newName.value;
        const userNamesArray = await getAllUserNames();
        for (let i = 0; i < userNamesArray.length; i++) {
            if (newNameValue == userNamesArray[i].username) {
                testLabel.innerHTML = `User name already exists!`;
                break;
            }
        }
    });

//2.verify the new password:
const isMatch = document.querySelector("#passwordMatch");
    const newPassword = document.querySelector("#newpasswordid");
    const confirmNew = document.querySelector("#confirmnewid");

    confirmNew.addEventListener("input", function () {
        isMatch.innerHTML = "";
        let passWordValue1 = newPassword.value;
        let passWordValue2 = confirmNew.value;

        if(passWordValue1 != passWordValue2){
            isMatch.innerHTML = `Different password input!`;
        }
    });

//3.avatar related codes:
const Handlebars = require('handlebars');
Handlebars.registerHelper('isEqual', function(a,b){
    return a === b;
});

document.getElementById('openModalLink').addEventListener('click', openModal);

function openModal() {
    const modal = document.getElementById('avatarModal');
    
    $.ajax({
        url:"/getAvatars",
        method: "get",
        success: function() {
            modal.style.display = 'block';
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function closeModal() {
    const modal = document.getElementById('avatarModal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('avatarModal');
    if(event.target != modal) {
        closeModal();
    }
}

function savaAvatar(){
    const selectedAvatarFilename = document.querySelector('input[name="avatar"]:checked').value;
    const avatarImage = document.querySelector('#nowAvatar');
        
    if(selectedAvatarFilename == null) {
        const uploadImage = document.getElementById('uploadImg');
        uploadImage.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const fileName = file.name;
                console.log(fileName);
                avatarImage.src = `/images/icons/${fileName}`;
            } else {
                alert('There is no changes to save!');
            }
          });
    } else {
        const selectedAvatarUrl = `/images/icons/${selectedAvatarFilename}`;
        avatarImage.src = selectedAvatarUrl;
    }
    closeModal();
}

const saveAvatarBtn = document.getElementById('saveAvatar');
saveAvatarBtn.addEventListener('click', function(){
    savaAvatar();
})

const closeModalBtn = document.getElementById('closeModal');
closeModalBtn.addEventListener('click', function(){
    closeModal();
})

//4.verify old password:
$(document).ready(function(){
    $("#verifyBtn").click(function () { 
        let oldpassword = $("input[name='oldpassword']").val();
        
        $.ajax({
            url: "/verifyOldPassword",
            method:"POST",
            data: {oldPassword: oldpassword},
            success: function (response) {
                if(response.success) {
                    $("input[name='newpassword']").prop("disabled", false);
                    $("input[name='confirmnew']").prop("disabled", false);
                }
            }
        });
    });
});

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
            alert("Saved!");
        },
        error: function() {
            alert("Save failed, please try again.");
        }
    });
});

