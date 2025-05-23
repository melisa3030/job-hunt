import { UsersApi } from '../api/usersApi.js';

export const initManageAdminUsers = () => {
  const usersList = document.getElementById('usersList');
  const loadingMessage = document.getElementById('loadingMessage');
  const noUsersMessage = document.getElementById('noUsersMessage');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchType = document.getElementById('searchType');
  const pagination = document.getElementById('pagination');
  const createUserBtn = document.getElementById('createUserBtn');

  // Create user modal elements
  const createUserModal = document.getElementById('createUserModal');
  const createUserForm = document.getElementById('createUserForm');
  const createName = document.getElementById('createName');
  const createUsername = document.getElementById('createUsername');
  const createEmail = document.getElementById('createEmail');
  const createPassword = document.getElementById('createPassword');
  const createRole = document.getElementById('createRole');
  const saveNewUser = document.getElementById('saveNewUser');

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

  // Event listeners

  searchBtn.addEventListener('click', function () {
    filterUsers();
  });

  searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      filterUsers();
    }
  });

  createUserBtn.addEventListener('click', function () {
    openCreateUserModal();
  });

  saveNewUser.addEventListener('click', function () {
    if (createUserForm.checkValidity()) {
      createUser();
    } else {
      createUserForm.reportValidity();
    }
  });

  saveUserChanges.addEventListener('click', function () {
    if (editUserForm.checkValidity()) {
      updateUser();
    } else {
      editUserForm.reportValidity();
    }
  });

  confirmDeleteUser.addEventListener('click', function () {
    const userId = confirmDeleteUser.getAttribute('data-user-id');
    deleteUser(userId);
  });

  // CRUD operations

  async function createUser() {
    const userData = {
      name: createName.value,
      username: createUsername.value,
      email: createEmail.value,
      password: createPassword.value,
      role: createRole.value,
    };

    try {
      showLoading(true);

      const response = await UsersApi.createUser(userData);
      console.log(response);

      if (response && response.message) {
        const modal = bootstrap.Modal.getInstance(createUserModal);
        modal.hide();

        // Reload all users from the server to latest data
        await loadUsers();

        showSuccess(response.message || 'User created successfully!');
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showError('Failed to create user. Please try again.');
    } finally {
      showLoading(false);
    }
  }

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

  async function deleteUser(userId) {
    try {
      await UsersApi.deleteUser(userId);

      currentUsers = currentUsers.filter(
        (user) => user.id.toString() !== userId.toString()
      );
      filteredUsers = filteredUsers.filter(
        (user) => user.id.toString() !== userId.toString()
      );

      try {
        const modal = bootstrap.Modal.getInstance(deleteUserModal);
        if (modal) {
          modal.hide();
        } else {
          // Manual closing
          deleteUserModal.classList.remove('show');
          deleteUserModal.style.display = 'none';
          document.body.classList.remove('modal-open');

          // Remove backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
      } catch (error) {
        console.error('Error closing modal:', error);
      }

      displayUsers(currentPage);
      setupPagination();

      showSuccess('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user. Please try again.');
    }
  }

  async function updateUser() {
    const userId = editUserId.value;

    const userData = {
      name: editName.value,
      email: editEmail.value,
    };

    if (editRole.value) {
      userData.role = editRole.value;
    }

    try {
      await UsersApi.updateUser(userId, userData);

      // Update the local user data
      const userIndex = currentUsers.findIndex(
        (user) => user.id.toString() === userId.toString()
      );
      if (userIndex !== -1) {
        // Update the user in our array
        currentUsers[userIndex] = {
          ...currentUsers[userIndex],
          ...userData,
        };

        // Update filtered users if needed
        const filteredIndex = filteredUsers.findIndex(
          (user) => user.id.toString() === userId.toString()
        );
        if (filteredIndex !== -1) {
          filteredUsers[filteredIndex] = {
            ...filteredUsers[filteredIndex],
            ...userData,
          };
        }
      }

      // Close modal
      const modal = bootstrap.Modal.getInstance(editUserModal);
      modal.hide();

      // Update display
      displayUsers(currentPage);

      showSuccess('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      showError('Failed to update user. Please try again.');
    }
  }

  // Filter users based on search
  async function filterUsers() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const searchBy = searchType.value;

    if (searchValue === '') {
      filteredUsers = [...currentUsers];
    } else {
      // Client-side filtering
      filteredUsers = currentUsers.filter((user) => {
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

  // Display users for the current page
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
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${startIndex + index + 1}</td>
      <td>${user.id}</td>
      <td>${user.name || ''}</td>
      <td>${user.username || ''}</td>
      <td>${user.email || ''}</td>
      <td><span class="badge ${getRoleBadgeClass(user.role)}">${user.role || 'APPLICANT'}</span></td>
      <td>
        <button class="btn btn-sm btn-primary edit-user" data-user-id="${user.id}">
          Edit
        </button>
        <button class="btn btn-sm btn-danger delete-user" data-user-id="${user.id}" data-user-name="${user.name}">
         Delete
        </button>
      </td>
    `;
      usersList.appendChild(row);
    });

    document.querySelectorAll('.edit-user').forEach((button) => {
      button.addEventListener('click', function () {
        const userId = this.getAttribute('data-user-id');
        openEditModal(userId);
      });
    });

    document.querySelectorAll('.delete-user').forEach((button) => {
      button.addEventListener('click', function () {
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

    prevLi.addEventListener('click', function (e) {
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

      pageLi.addEventListener('click', function (e) {
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

    nextLi.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayUsers(currentPage);
        setupPagination();
      }
    });
  }

  // Modals
  function openCreateUserModal() {
    // Reset the form
    createUserForm.reset();

    // Set default role
    createRole.value = 'APPLICANT';

    try {
      // Try Bootstrap 5 Modal constructor first
      const bsModal = new bootstrap.Modal(createUserModal);
      bsModal.show();
    } catch (error) {
      // Fallback to showing manually
      createUserModal.classList.add('show');
      createUserModal.style.display = 'block';
      document.body.classList.add('modal-open');

      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
      }
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  async function openEditModal(userId) {
    try {
      // Get user data from local array for better performance
      const user = currentUsers.find(
        (user) => user.id.toString() === userId.toString()
      );

      if (user) {
        editUserId.value = user.id;
        editName.value = user.name;
        editEmail.value = user.email;
        editRole.value = user.role || 'APPLICANT';

        try {
          // Try Bootstrap 5 Modal constructor first
          const bsModal = new bootstrap.Modal(editUserModal);
          bsModal.show();
        } catch (error) {
          // Fallback to showing manually
          editUserModal.classList.add('show');
          editUserModal.style.display = 'block';
          document.body.classList.add('modal-open');

          let backdrop = document.querySelector('.modal-backdrop');
          if (!backdrop) {
            backdrop = document.createElement('div');
          }
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error opening edit modal:', error);
      showError('Could not load user details. ');
    }
  }

  function openDeleteModal(userId, userName) {
    deleteUserName.textContent = userName;
    confirmDeleteUser.setAttribute('data-user-id', userId);

    try {
      // Try Bootstrap 5 Modal constructor first
      const bsModal = new bootstrap.Modal(deleteUserModal);
      bsModal.show();
    } catch (error) {
      // Fallback to showing manually
      deleteUserModal.classList.add('show');
      deleteUserModal.style.display = 'block';
      document.body.classList.add('modal-open');

      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
      }
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
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
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;

    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    alertsContainer.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  function showSuccess(message) {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;

    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

    alertsContainer.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  function getRoleBadgeClass(role) {
    switch (role) {
      case 'ADMIN':
        return 'bg-danger';
      case 'EMPLOYER':
        return 'bg-primary';
      case 'APPLICANT':
      default:
        return 'bg-success';
    }
  }

  // Initialize the page
  loadUsers();
};
