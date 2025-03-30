// import { messages } from "../lang/messages/en/userMSG.js";
import { validateEmail } from './validation.js';

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Collect the form data
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!validateEmail(username)) {
    document.getElementById('message').innerHTML = messages.invalidEmail;
    document.getElementById('message').style.color = 'red';
    return;
  }

  const data = { username, password };

  try {
    // Make an AJAX POST request to the login endpoint
    const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Check if the request was successful
    if (response.ok) {
      const result = await response.json();
      document.getElementById('message').textContent = messages.loginOK;


      // Check if the user is an admin
      if (result.isAdmin === true) {
        // Redirect to the admin dashboard
        window.location.href = './dashboard.html';
      } else {
        // Redirect to the landing page
        window.location.href = './t2t.html';
      }
    } else {
      document.getElementById('message').textContent = messages.loginFail;
      document.getElementById('message').style.color = 'red';
    }
  } catch (error) {
    document.getElementById('message').textContent = messages.loginErr;
    document.getElementById('message').style.color = 'red';
    console.error('Error during login:', error);
  }
});
