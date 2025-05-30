import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to fetch companies'
          : null,
      };
    } catch (error) {
      console.error('Error fetching companies:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to get company by ID'
          : null,
      };
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to get company by employer ID'
          : null,
      };
    } catch (error) {
      console.error(`Error fetching company with employer ID ${id}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to get company for current employer'
          : null,
      };
    } catch (error) {
      console.error('Error fetching company for current employer:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to create company'
          : null,
      };
    } catch (error) {
      console.error('Error creating company:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async createCompanyForEmployer(companyData) {
    try {
      const response = await fetch(`${BASE_URL}/company_for_employer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to create company'
          : null,
      };
    } catch (error) {
      console.error(`Error creating company:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async updateCompany(companyId, companyData) {
    try {
      const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to update company'
          : null,
      };
    } catch (error) {
      console.error('Error updating company:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async deleteCompany(companyId) {
    try {
      const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
        method: 'DELETE',
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
          ? data?.message || 'Failed to delete company'
          : null,
      };
    } catch (error) {
      console.error('Error deleting company:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
