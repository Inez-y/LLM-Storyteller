import * as messages from "../lang/messages/en/userMSG.js";

const fetchUser = async () => {
    const res = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/me', {
      credentials: 'include'
    });
    const user = await res.json();
    console.log('Logged in as:', user.username);
  };