import messages from "front/lang/messages/en/user.js"

/**
 * @class InitializeGame
 * @description Handles the initialization of the front logic.
 */
class Initialize {
   
}

// Logic is automatically ready when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginButton").addEventListener("click", () => {
        window.location.href("../html/login.html")
    });
});