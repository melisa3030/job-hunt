import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get companies');
      }
      return response.json();
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get company');
      }
      return response.json();
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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get company');
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching company with employer ID ${id}:`, error);
      throw error;
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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get company');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching company for current employer:', error);
      throw error;
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);

        // Try to parse error message from response
        try {
          const errorObj = JSON.parse(errorText);
          throw new Error(errorObj.message || 'Failed to create company');
        } catch (parseError) {
          throw new Error('Failed to create company');
        }
      }

      const result = await response.json();
      console.log('Company creation result:', result);
      return result;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to update company');
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      throw error;
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to create company');
      }
      return true;
    } catch (error) {
      console.error(`Error deleting company with ID ${id}:`, error);
      throw error;
    }
  },
};
