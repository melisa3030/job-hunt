import { BASE_URL } from '../constants/constants.js';

export const AuthApi = {
  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  getCachedUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  clearUserCache() {
    localStorage.removeItem('user');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  async getCurrentUser() {
    if (!this.isAuthenticated()) {
      this.clearUserCache();
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const userData = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, userData);
        throw new Error(userData.message || 'Failed to fetch user data');
      }

      // Store fresh user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.logout(); // Clears token + user
      return null;
    }
  },

  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const { token, user } = data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async refreshCurrentUser() {
    if (!this.isAuthenticated()) {
      this.clearUserCache();
      return null;
    }

    try {
      const token = this.getToken();
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to refresh user data');
      }

      // Update token and user data in localStorage
      const { token: newToken, ...userData } = data.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      this.logout(); // Clears token + user
      return null;
    }
  },


};
