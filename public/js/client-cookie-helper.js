/**
 * This function sets / adds a cookie with the given name, value, and expiry time.
 * 
 * @param {*} cname the name of the cookie to add / change
 * @param {*} cvalue the (new) value of the cookie
 * @param {*} expiryInDays the cookie's expiry time, in days.
 */
function setCookie(cname, cvalue, expiryInDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryInDays * 24 * 60 * 60 * 1000));
    document.cookie = `${cname}=${cvalue}; expires=${d.toUTCString()}; path=/`;
}

/**
 * This function deletes the cookie with the given name, if any.
 * 
 * @param {*} cname the name of the cookie to delete
 */
function deleteCookie(cname) {
    const d = new Date();
    d.setDate(0);
    document.cookie = `${cname}=; expires=${d.toUTCString()}; path=/`;
}

/**
 * This function check if the certain cookie exists.
 * 
 * @param {*} cname the name of the cookie to check
 */
function getCookie(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return true;
        }
    }
    return false;
}

/**
 * This function return the cookie value.
 * 
 * @param {*} cname the name of the cookie to check
 */
function getCookieValue(cname) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return undefined;
}