document.addEventListener('DOMContentLoaded', () => {
  // Define the base URL using an environment variable.
  // When using a bundler, ensure that process.env.API_BASE_URL is replaced with the actual value.
  const API_BASE_URL = 'https://storyteller-server-yrha7.ondigitalocean.app';
  const tableBody = document.querySelector('#usersTable tbody');

  // Fetch users from the API and populate the table
  async function fetchUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/get-users`);
      if (!response.ok) throw new Error('Failed to fetch users');       
      const users = await response.json();
      console.log(users);
      tableBody.innerHTML = '';
      users.forEach(user => addUserRow(user));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Add a row for a user to the table
  function addUserRow(user) {
    const tr = document.createElement('tr');

    // ID cell (non-editable)
    const tdId = document.createElement('td');
    tdId.textContent = user.id;
    tr.appendChild(tdId);

    // Username cell (editable)
    const tdUsername = document.createElement('td');
    tdUsername.textContent = user.username;
    tdUsername.classList.add('editable');
    tdUsername.addEventListener('click', () => makeCellEditable(tdUsername, user, 'username'));
    tr.appendChild(tdUsername);

    // Password cell (editable)
    const tdPassword = document.createElement('td');
    tdPassword.textContent = user.password;
    tdPassword.classList.add('editable');
    tdPassword.addEventListener('click', () => makeCellEditable(tdPassword, user, 'password'));
    tr.appendChild(tdPassword);

    // Actions cell with a Delete button
    const tdActions = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteUser(user.id, tr));
    tdActions.appendChild(deleteBtn);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  }

  // Convert a table cell into an editable input
  function makeCellEditable(td, user, field) {
    if (td.querySelector('input')) return; // Already editing

    const originalValue = td.textContent;
    td.textContent = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalValue;
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value;
      td.textContent = newValue;
      if (newValue !== originalValue) {
        updateUser(user.id, field, newValue, originalValue, input);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }

  // Update a user record via API using the environment variable for the URL
  async function updateUser(userId, field, newValue, originalValue, inputWindow) {
    try {
      const response = await fetch(`${API_BASE_URL}/update-user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, [field]: newValue })
      });
      if (!response.ok) throw new Error('Failed to update user');
      console.log(`User ${userId} updated: ${field} set to ${newValue}`);
    } catch (error) {
      inputWindow.value = originalValue;
      console.error('Error updating user:', error);

    }
  }

  // Delete a user record via API using the environment variable for the URL
  async function deleteUser(userId, rowElement) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/delete-user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      if (!response.ok) throw new Error('Failed to delete user');
      rowElement.remove();
      console.log(`User ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // Initial fetch to populate the table
  fetchUsers();
});
