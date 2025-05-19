// login.js
import { AuthApi } from './api/authApi.js';
import renderNavbar from './components/navbar.js';

export const initLoginForm = () => {
  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('login_error');

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

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showError('All fields are required');
      return;
    }

    try {
      await AuthApi.login(email, password);
      // Re-render navbar immediately after successful login
      await renderNavbar();

      form.innerHTML = `
        <div class="alert alert-success">
          Login successful! Redirecting to home page...
        </div>
      `;

      setTimeout(() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }
  });
};