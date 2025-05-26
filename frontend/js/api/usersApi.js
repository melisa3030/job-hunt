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
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to get users');
      }
      return data;
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
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch user');
      }
      return data;
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
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch user');
      }
      return data;
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
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch users');
      }
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(userData, isEmployer = false) {
    try {
      userData.role = isEmployer ? 'EMPLOYER' : 'APPLICANT';

      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to create user');
      }
      return data;
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

        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, resData);
        throw new Error(resData.message || 'Failed to update user');
      }
      return resData;
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
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to delete user');
      }
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  async getAllEmployers() {
    try {
      const response = await fetch(`${BASE_URL}/users/employers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch employers');
      }
      return data;
    } catch (error) {
      console.error('Error fetching employers:', error);
      throw error;
    }
  },

  async getApplicantById(id) {
    try {
      const response = await fetch(`${BASE_URL}/users/applicant/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch applicant');
      }
      return data;
    } catch (error) {
      console.error('Error fetching applicant:', error);
      throw error;
    }
  },

  async getApplicants() {
    try {
      const response = await fetch(`${BASE_URL}/users/applicants`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch applicants');
      }
      return data;
    } catch (error) {
      console.error('Error fetching applicants:', error);
      throw error;
    }
  },

  async getApplicantsById(id) {
    try {
      const response = await fetch(`${BASE_URL}/users/applicant/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch applicants');
      }
      return data;
    } catch (error) {
      console.error('Error fetching applicants:', error);
      throw error;
    }
  },
};
