import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

// TODO: Update all other API functions to use the same error handling pattern

export const CompaniesApi = {
  async getAllCompanies() {
    try {
      const response = await fetch(`${BASE_URL}/companies`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to get companies');
      }
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  async getCompanyById(id) {
    try {
      const response = await fetch(`${BASE_URL}/companies/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to get company by ID');
      }
      return data;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  },

  async getCompanyByEmployerId(id) {
    try {
      const response = await fetch(`${BASE_URL}/companies/employer/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to get company by employer ID');
      }
      return data;
    } catch (error) {
      console.error(`Error fetching company with employer ID ${id}:`, error);
    }
  },

  async getCompanyForCurrentEmployer() {
    try {
      const response = await fetch(`${BASE_URL}/companies/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || 'Failed to get company for current employer'
        );
      }
      return data;
    } catch (error) {
      console.error('Error fetching company for current employer:', error);
    }
  },

  async createCompany(companyData) {
    try {
      console.log('Creating company with data:', companyData);

      const response = await fetch(`${BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to create company');
      }

      return data;
    } catch (error) {
      console.error('Error creating company:', error);
    }
  },
  async updateCompany(id, companyData) {
    try {
      const response = await fetch(`${BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to update company');
      }
      return data;
    } catch (error) {
      console.error(`Error updating company with ID ${id}:`, error);
    }
  },
  async deleteCompany(id) {
    try {
      const response = await fetch(`${BASE_URL}/companies/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to delete');
      }

      return true;
    } catch (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
    }
  },
};
