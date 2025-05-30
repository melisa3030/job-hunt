import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to get users' : null,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to fetch user' : null,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to fetch user' : null,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to fetch users' : null,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to create user' : null,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, resData);

      return {
        success: response.ok,
        data: response.ok ? resData : null,
        error: !response.ok ? resData.message || 'Failed to update user' : null,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      const data = response.status !== 204 ? await response.json() : null;

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data?.message || 'Failed to delete user' : null,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || 'Failed to fetch employers'
          : null,
      };
    } catch (error) {
      console.error('Error fetching employers:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || 'Failed to fetch applicant'
          : null,
      };
    } catch (error) {
      console.error('Error fetching applicant:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || 'Failed to fetch applicants'
          : null,
      };
    } catch (error) {
      console.error('Error fetching applicants:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || 'Failed to fetch applicants'
          : null,
      };
    } catch (error) {
      console.error('Error fetching applicants:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
