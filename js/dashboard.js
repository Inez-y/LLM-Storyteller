document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#usersTable tbody');

    // Fetch users from the API and populate the table
    async function fetchUsers() {
      try {
        const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/get-users');
        if (!response.ok) throw new Error('Failed to fetch users');
        console.log(response.json());
        const users = await response.json();
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
      // If already editing, do nothing.
      if (td.querySelector('input')) return;

      const originalValue = td.textContent;
      td.textContent = '';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalValue;
      td.appendChild(input);
      input.focus();

      // Update when focus is lost or when Enter is pressed.
      input.addEventListener('blur', () => {
        const newValue = input.value;
        td.textContent = newValue;
        if (newValue !== originalValue) {
          updateUser(user.id, field, newValue);
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    }

    // Update a user record via API
    async function updateUser(userId, field, newValue) {
      try {
        const response = await fetch('/update-user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId, [field]: newValue })
        });
        if (!response.ok) throw new Error('Failed to update user');
        console.log(`User ${userId} updated: ${field} set to ${newValue}`);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }

    // Delete a user record via API
    async function deleteUser(userId, rowElement) {
      if (!confirm('Are you sure you want to delete this user?')) return;
      try {
        const response = await fetch('https://storyteller-server-yrha7.ondigitalocean.app/delete-user', {
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