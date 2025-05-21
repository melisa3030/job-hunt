import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const UsersApi = {
  async getAllUsers() {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get users');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Rethrow to allow proper handling upstream
    }
  },

  async getUserById(id) {
    try {
      const response = await fetch(`${BASE_URL}/users?id=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const response = await fetch(`${BASE_URL}/users?email=${email}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async getUsersByName(name) {
    try {
      const response = await fetch(`${BASE_URL}/users?name=${name}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to fetch users');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  async createUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to create user');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  async updateUser(id, data) {
    try {
      console.log(data);

      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log(response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to update user');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  async deleteUser(id) {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to delete user');
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
