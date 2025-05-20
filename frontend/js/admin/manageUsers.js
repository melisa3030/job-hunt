import { UsersApi } from '../api/usersApi.js';

export const initManageUsers = () => {
  const usersList = document.getElementById('usersList');
  const loadingMessage = document.getElementById('loadingMessage');
  const noUsersMessage = document.getElementById('noUsersMessage');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchType = document.getElementById('searchType');
  const pagination = document.getElementById('pagination');

  // Edit modal elements
  const editUserModal = document.getElementById('editUserModal');
  const editUserForm = document.getElementById('editUserForm');
  const editUserId = document.getElementById('editUserId');
  const editName = document.getElementById('editName');
  const editEmail = document.getElementById('editEmail');
  const editRole = document.getElementById('editRole');
  const saveUserChanges = document.getElementById('saveUserChanges');

  // Delete modal elements
  const deleteUserModal = document.getElementById('deleteUserModal');
  const deleteUserName = document.getElementById('deleteUserName');
  const confirmDeleteUser = document.getElementById('confirmDeleteUser');

  let currentPage = 1;
  const itemsPerPage = 10;
  let currentUsers = [];
  let filteredUsers = [];

  // Search functionality
  searchBtn.addEventListener('click', function() {
    filterUsers();
  });

  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      filterUsers();
    }
  });

  // Save user changes
  saveUserChanges.addEventListener('click', function() {
    if (editUserForm.checkValidity()) {
      updateUser();
    } else {
      editUserForm.reportValidity();
    }
  });

  // Confirm delete user
  confirmDeleteUser.addEventListener('click', function() {
    const userId = confirmDeleteUser.getAttribute('data-user-id');
    deleteUser(userId);
  });

  // Load users from API
  async function loadUsers() {
    showLoading(true);

    try {
      const users = await UsersApi.getAllUsers();
      if (users) {
        currentUsers = users;
        filteredUsers = [...currentUsers];
        displayUsers(currentPage);
        setupPagination();
      } else {
        throw new Error('Failed to fetch users data');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showError('Failed to load users. Please try again later.');
    } finally {
      showLoading(false);
    }
  }

  // Filter users based on search
  async function filterUsers() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const searchBy = searchType.value;

    if (searchValue === '') {
      filteredUsers = [...currentUsers];
    } else {
      // Client-side filtering for better reliability
      filteredUsers = currentUsers.filter(user => {
        if (searchBy === 'name') {
          return user.name.toLowerCase().includes(searchValue);
        } else if (searchBy === 'id') {
          return user.id.toString().includes(searchValue);
        }
        return false;
      });
    }

    currentPage = 1;
    displayUsers(currentPage);
    setupPagination();
  }

  // Display users for current page
  function displayUsers(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

    usersList.innerHTML = '';

    if (usersToDisplay.length === 0) {
      noUsersMessage.classList.remove('d-none');
      return;
    }

    noUsersMessage.classList.add('d-none');

    usersToDisplay.forEach((user, index) => {
      const userRow = document.createElement('div');
      userRow.className = 'list-group-item';
      userRow.innerHTML = `
        <div class="row align-items-center">
          <div class="col-1">${startIndex + index + 1}</div>
          <div class="col-2">${user.id}</div>
          <div class="col-3">${user.name}</div>
          <div class="col-3">${user.email}</div>
          <div class="col-3">
            <button class="btn btn-sm btn-primary edit-user" data-user-id="${user.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger delete-user" data-user-id="${user.id}" data-user-name="${user.name}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
      usersList.appendChild(userRow);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-user').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        openEditModal(userId);
      });
    });

    document.querySelectorAll('.delete-user').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-user-id');
        const userName = this.getAttribute('data-user-name');
        openDeleteModal(userId, userName);
      });
    });
  }

  // Set up pagination
  function setupPagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    pagination.innerHTML = '';

    if (totalPages <= 1) {
      return;
    }

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    pagination.appendChild(prevLi);

    prevLi.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayUsers(currentPage);
        setupPagination();
      }
    });

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
      pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pagination.appendChild(pageLi);

      pageLi.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = i;
        displayUsers(currentPage);
        setupPagination();
      });
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    pagination.appendChild(nextLi);

    nextLi.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayUsers(currentPage);
        setupPagination();
      }
    });
  }

  // Open edit user modal
  async function openEditModal(userId) {
    try {
      // Get user data from our local array for better performance
      const user = currentUsers.find(user => user.id.toString() === userId.toString());

      if (user) {
        editUserId.value = user.id;
        editName.value = user.name;
        editEmail.value = user.email;
        editRole.value = user.role || 'APPLICANT';

        const modal = new bootstrap.Modal(editUserModal);
        modal.show();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error opening edit modal:', error);
      showAlert('danger', 'Could not load user details. Please try again.');
    }
  }

  // Update user
  async function updateUser() {
    const userId = editUserId.value;

    // Build the userData object with the required fields
    const userData = {
      name: editName.value,
      email: editEmail.value
    };

    // Only include role if it has a value
    if (editRole.value) {
      userData.role = editRole.value;
    }


    try {
      // Use the UsersApi updateUser method
      await UsersApi.updateUser(userId, userData);

      // Update the local user data
      const userIndex = currentUsers.findIndex(user => user.id.toString() === userId.toString());
      if (userIndex !== -1) {
        // Update the user in our array
        currentUsers[userIndex] = {
          ...currentUsers[userIndex],
          ...userData
        };

        // Update filtered users if needed
        const filteredIndex = filteredUsers.findIndex(user => user.id.toString() === userId.toString());
        if (filteredIndex !== -1) {
          filteredUsers[filteredIndex] = {
            ...filteredUsers[filteredIndex],
            ...userData
          };
        }
      }

      // Close modal
      const modal = bootstrap.Modal.getInstance(editUserModal);
      modal.hide();

      // Update display
      displayUsers(currentPage);

      showAlert('success', 'User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showAlert('danger', 'Failed to update user. Please try again.');
    }
  }

  // Open delete confirmation modal
  function openDeleteModal(userId, userName) {
    deleteUserName.textContent = userName;
    confirmDeleteUser.setAttribute('data-user-id', userId);

    const modal = new bootstrap.Modal(deleteUserModal);
    modal.show();
  }

  // Delete user
  async function deleteUser(userId) {
    try {
      // Use the UsersApi deleteUser method
      await UsersApi.deleteUser(userId);

      // Remove user from arrays
      currentUsers = currentUsers.filter(user => user.id.toString() !== userId.toString());
      filteredUsers = filteredUsers.filter(user => user.id.toString() !== userId.toString());

      // Close modal
      const modal = bootstrap.Modal.getInstance(deleteUserModal);
      modal.hide();

      // Update display
      displayUsers(currentPage);
      setupPagination();

      showAlert('success', 'User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('danger', 'Failed to delete user. Please try again.');
    }
  }

  // Helper functions
  function showLoading(isLoading) {
    if (isLoading) {
      loadingMessage.classList.remove('d-none');
      noUsersMessage.classList.add('d-none');
    } else {
      loadingMessage.classList.add('d-none');
    }
  }

  function showError(message) {
    noUsersMessage.textContent = message;
    noUsersMessage.classList.remove('d-none');
  }

  function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.admin-users');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
  }

  // Initialize the page
  loadUsers();
};