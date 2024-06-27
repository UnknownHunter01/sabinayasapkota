function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    console.log("Cookie set: " + name + "=" + value);
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkRefresh() {
    var refreshCookie = getCookie("hasRefreshed");
    console.log("Check cookie: " + refreshCookie);
    if (!refreshCookie) {
        setCookie("hasRefreshed", "true", 1); // set cookie to expire in 1 day
        console.log("Redirecting to #home section");
        window.location.href = window.location.origin + window.location.pathname + "#home";
    } else {
        console.log("No redirect needed, cookie found.");
    }
}
