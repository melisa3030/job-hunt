import { BASE_URL } from '../constants/constants.js';

export const CompaniesApi = {
  async getAllCompanies() {
    try {
      const response = await fetch(`${BASE_URL}/companies`);
      if (!response.ok) throw new Error('Failed to fetch companies');
      return response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }
};

