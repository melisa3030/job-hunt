export const initSignupForm = () => {
  const form = document.getElementById('signup-form');
  const errorMessage = document.getElementById('signup_error');

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
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
            Registration successful! Redirecting to log in...
        </div>
    `;

      setTimeout(() => {
        window.history.pushState({}, '', '/login');  // Updates URL to /login
        window.dispatchEvent(new PopStateEvent('popstate')); // Triggers router to show login page
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message);
    }

  });
};
