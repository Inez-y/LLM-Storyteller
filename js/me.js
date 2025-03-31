// This code was completed with the help of ChatGPT

import * as messages from "../lang/messages/en/userMSG.js";

const getUserData = async () => {
  try {
    const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' // ensures cookies are sent
    });
    const data = await response.json();
    console.log("User data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
