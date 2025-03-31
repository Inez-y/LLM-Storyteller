import * as messages from "../lang/messages/en/userMSG.js";

// Correct GET request without a body and with credentials
const getUserId = async () => {
  try {
    const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'  // include cookies in the request
    });
    const data = await response.json();
    console.log("User data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
