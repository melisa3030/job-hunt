import { BASE_URL } from './constants/constants.js';

export const initSignupForm = () => {
  const form = document.getElementById('signup-form');
  const errorMessage = document.getElementById('signup_error');
  const applicantBtn = document.getElementById('applicant-btn');
  const employerBtn = document.getElementById('employer-btn');

  // Default to applicant
  let isEmployer = false;

  applicantBtn.addEventListener('click', () => {
    applicantBtn.classList.add('active');
    employerBtn.classList.remove('active');
    isEmployer = false;
  });

  employerBtn.addEventListener('click', () => {
    employerBtn.classList.add('active');
    applicantBtn.classList.remove('active');
    isEmployer = true;
  });

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  };

  const hideError = () => {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const formData = {
      name: form.name.value.trim(),
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    };

    // Basic validation
    if (
      !formData.name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      showError('All fields are required');
      return;
    }

    try {
      // Choose endpoint based on account type
      const endpoint = isEmployer
        ? `${BASE_URL}/users/employer`
        : `${BASE_URL}/users`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Then try to parse it
      const data = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Show a success message before redirect
      form.innerHTML = `
        <div class="alert alert-success">
            ${isEmployer ? 'Employer' : 'Applicant'} registration successful! Redirecting to log in...
        </div>
      `;

      setTimeout(() => {
        window.history.pushState({}, '', '/login'); // Updates URL to /login
        window.dispatchEvent(new PopStateEvent('popstate')); // Triggers router to show login page
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }
  });
};
