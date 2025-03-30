import * as messages from "../lang/messages/en/userMSG.js";

import { validateEmail } from './validation.js';


document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Collect values from the form fields
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!validateEmail(username)) {
    document.getElementById('message').innerHTML = messages.invalidEmail;
    document.getElementById('message').style.color = 'red';
    return;
  }

  const data = { username, password };

  try {
    // Make an AJAX POST request to the registration endpoint
    const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Include cookies in the request
      body: JSON.stringify(data)
    });


    // Check the response status and update the UI accordingly
    if (response.ok) {
      const result = await response.json();
      document.getElementById('message').textContent = messages.regisOK;
      // You can redirect the user or perform other actions here
    } else {
      document.getElementById('message').textContent = messages.regisFail;
    }
  } catch (error) {
    document.getElementById('message').textContent = messages.regisErr;
    console.error('Error during registration:', error);
  }
});
