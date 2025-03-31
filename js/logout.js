// This code was completed with the help of ChatGPT

import * as messages from "../lang/messages/en/userMSG.js";


document.getElementById('logoutBtn').addEventListener('click', async function () {
    try {
        console.log("Try logging out...")
        const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/logout', {
            method: 'GET',
            credentials: 'include' // add cookie
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.messages);
            window.location.href = 'https://storyteller-us7ph.ondigitalocean.app/'; // redirection to landing page
        } else {
            document.getElementById('message').textContent = messages.logoutFail;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        console.error('Error during logout:', error);
        document.getElementById('message').textContent = messages.logoutErr
        document.getElementById('message').style.color = 'red';
    }
});
