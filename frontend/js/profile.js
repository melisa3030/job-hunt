/* global bootstrap */
import { AuthApi } from './api/authApi.js';
import { UsersApi } from './api/usersApi.js';

export async function initProfile() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const profileForm = document.getElementById('profile-form');
  const alertsContainer = document.getElementById('alerts-container');
  const loadingSpinner = document.getElementById('loading-spinner');
    const profileName = document.getElementById('profile-name');
  const profileUsername = document.getElementById('profile-username');
  const profileEmail = document.getElementById('profile-email');
  
  const currentPassword = document.getElementById('current-password');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  let currentUser = null;
  let originalUserData = null;

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    profileForm?.addEventListener('submit', handleFormSubmit);
    cancelBtn?.addEventListener('click', handleCancel);
    
    // Password validation
    confirmPassword?.addEventListener('input', validatePasswordMatch);
    newPassword?.addEventListener('input', validatePasswordMatch);
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadUserProfile() {
    try {
      showLoading(true);
      
      currentUser = await AuthApi.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Get full user details
      const userResponse = await UsersApi.getCurrentUserData();
      if (userResponse && userResponse.success) {
        currentUser = userResponse.data;
        originalUserData = { ...currentUser };
        populateForm(currentUser);
      } else {
        throw new Error('Failed to load user profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showError('Failed to load profile. Please refresh the page.');
    } finally {
      showLoading(false);
    }
  }
  function populateForm(user) {
    profileName.value = user.name || '';
    profileUsername.value = user.username || '';
    profileEmail.value = user.email || '';
  }

  // ===========================
  // === Form Validation
  // ===========================
  function validatePasswordMatch() {
    const newPass = newPassword.value;
    const confirmPass = confirmPassword.value;
    
    if (newPass && confirmPass && newPass !== confirmPass) {
      confirmPassword.setCustomValidity('Passwords do not match');
      confirmPassword.classList.add('is-invalid');
    } else {
      confirmPassword.setCustomValidity('');
      confirmPassword.classList.remove('is-invalid');
    }
  }
  function validateForm() {
    let isValid = true;
    
    // Basic required field validation
    if (!profileName.value.trim()) {
      profileName.classList.add('is-invalid');
      isValid = false;
    } else {
      profileName.classList.remove('is-invalid');
    }
    
    if (!profileUsername.value.trim()) {
      profileUsername.classList.add('is-invalid');
      isValid = false;
    } else {
      profileUsername.classList.remove('is-invalid');
    }
    
    if (!profileEmail.value.trim() || !profileEmail.validity.valid) {
      profileEmail.classList.add('is-invalid');
      isValid = false;
    } else {
      profileEmail.classList.remove('is-invalid');
    }
    
    // Password validation - if user wants to change password
    if (newPassword.value) {
      // Current password is required when changing password
      if (!currentPassword.value) {
        currentPassword.classList.add('is-invalid');
        showError('Current password is required to change password');
        isValid = false;
      } else {
        currentPassword.classList.remove('is-invalid');
      }
      
      // Confirm password is required
      if (!confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        showError('Please confirm your new password');
        isValid = false;
      } else {
        confirmPassword.classList.remove('is-invalid');
      }
    } else {
      // If no new password, clear any validation errors on password fields
      currentPassword.classList.remove('is-invalid');
      confirmPassword.classList.remove('is-invalid');
    }
    
    // Validate password match (handled by validatePasswordMatch function)
    validatePasswordMatch();
    if (confirmPassword.classList.contains('is-invalid')) {
      isValid = false;
    }
    
    return isValid;
  }
  // ===========================
  // === Form Submission
  // ===========================
  async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
      profileForm.classList.add('was-validated');
      return;
    }
    
    try {
      showLoading(true);
      
      const profileData = {
        name: profileName.value.trim(),
        username: profileUsername.value.trim(),
        email: profileEmail.value.trim()
      };
      
      // Add password fields if provided
      if (newPassword.value) {
        profileData.password = newPassword.value;
        profileData.old_password = currentPassword.value;
        profileData.confirm_password = confirmPassword.value;
      }
      
      const response = await UsersApi.updateUser(currentUser.id, profileData);
      
      if (response && response.success) {
        showSuccess('Profile updated successfully!');
        
        // Clear password fields
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';

        // Update original data (excluding password fields)
        originalUserData = {
          name: profileData.name,
          username: profileData.username,
          email: profileData.email
        };
        
        // Remove validation classes
        profileForm.classList.remove('was-validated');
        document.querySelectorAll('.is-invalid').forEach(el => {
          el.classList.remove('is-invalid');
        });
          } else {
        throw new Error(response?.message || response?.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific backend validation errors
      let errorMessage = error.message;
      if (errorMessage.includes('Old password is incorrect')) {
        currentPassword.classList.add('is-invalid');
        errorMessage = 'Current password is incorrect';
      } else if (errorMessage.includes('Confirm password does not match')) {
        confirmPassword.classList.add('is-invalid');
        errorMessage = 'Password confirmation does not match';
      } else if (errorMessage.includes('User with this email already exists')) {
        profileEmail.classList.add('is-invalid');
        errorMessage = 'This email is already taken by another user';
      } else if (errorMessage.includes('User with this username already exists')) {
        profileUsername.classList.add('is-invalid');
        errorMessage = 'This username is already taken by another user';
      }
      
      showError(`Failed to update profile: ${errorMessage}`);
    } finally {
      showLoading(false);
    }
  }

  function handleCancel() {
    if (originalUserData) {
      populateForm(originalUserData);
    }
    
    // Clear password fields
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    // Remove validation classes
    profileForm.classList.remove('was-validated');
    document.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });
  }

  // ===========================
  // === Utility Functions
  // ===========================
  function showLoading(isLoading) {
    if (isLoading) {
      loadingSpinner.classList.remove('d-none');
      saveProfileBtn.disabled = true;
    } else {
      loadingSpinner.classList.add('d-none');
      saveProfileBtn.disabled = false;
    }
  }

  function showError(message) {
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

  // ===========================
  // === Initialization
  // ===========================
  setupEventListeners();
  await loadUserProfile();
}