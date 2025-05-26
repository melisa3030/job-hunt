import { UsersApi } from './api/usersApi.js';

// ===========================
// === Utility Functions
// ===========================

const showError = (errorMessage, message) => {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
};

const hideError = (errorMessage) => {
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
};

const validateForm = (formData) => {
  return (
    formData.name && formData.username && formData.email && formData.password
  );
};

const setupRoleSelection = (applicantBtn, employerBtn, state) => {
  applicantBtn.addEventListener('click', () => {
    applicantBtn.classList.add('active');
    employerBtn.classList.remove('active');
    state.isEmployer = false;
  });

  employerBtn.addEventListener('click', () => {
    employerBtn.classList.add('active');
    applicantBtn.classList.remove('active');
    state.isEmployer = true;
  });
};

// ===========================
// === Form Submission
// ===========================

const submitSignupForm = async (form, errorMessage, state) => {
  const formData = {
    name: form.name.value.trim(),
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
  };

  if (!validateForm(formData)) {
    showError(errorMessage, 'All fields are required');
    return;
  }

  try {
    await UsersApi.createUser(formData, state.isEmployer);
    // Show success message and redirect to login
    form.innerHTML = /* HTML */ `
      <div class="alert alert-success">
        ${state.isEmployer ? 'Employer' : 'Applicant'} registration successful!
        Redirecting to log in...
      </div>
    `;
    setTimeout(() => {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 1500);
  } catch (error) {
    console.error(error);
    // User doesn't need to know the exact error message
    showError(errorMessage, 'Signup failed');
  }
};

// ===========================
// === Initialization
// ===========================

export const initSignupForm = () => {
  // === DOM Elements & State ===
  const form = document.getElementById('signup-form');
  const errorMessage = document.getElementById('signup_error');
  const applicantBtn = document.getElementById('applicant-btn');
  const employerBtn = document.getElementById('employer-btn');
  const state = { isEmployer: false };

  setupRoleSelection(applicantBtn, employerBtn, state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError(errorMessage);
    submitSignupForm(form, errorMessage, state);
  });
};
