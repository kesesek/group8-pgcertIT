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