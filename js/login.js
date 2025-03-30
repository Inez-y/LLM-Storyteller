document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Collect the form data
  const username = document.getElementById('username').value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const password = document.getElementById('password').value;
  const data = { username, password };

  if (!emailPattern.test(username)) {
    document.getElementById('message').innerHTML = "Please enter a valid email address.";
    document.getElementById('message').style.color = 'red';
    return;
  } else {
    document.getElementById('message').innerHTML = "Logging in...";
    document.getElementById('message').style.color = 'green';
  }

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
      document.getElementById('message').textContent = 'Login successful!';


      // Check if the user is an admin
      if (result.isAdmin === true) {
        // Redirect to the admin dashboard
        window.location.href = './dashboard.html';
      } else {
        // Redirect to the landing page
        window.location.href = './t2t.html';
      }
    } else {
      document.getElementById('message').textContent = 'Login failed. Please try again.';
      document.getElementById('message').style.color = 'red';
    }
  } catch (error) {
    document.getElementById('message').textContent = 'An error occurred. Please try again.';
    document.getElementById('message').style.color = 'red';
    console.error('Error during login:', error);
  }
});
