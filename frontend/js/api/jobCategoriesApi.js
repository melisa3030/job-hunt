import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const JobCategoriesApi = {
  async getAllJobCategories() {
    try {
      const response = await fetch(`${BASE_URL}/job_categories`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  },

  async getJobCategoryById(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_categories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job category with ID ${id}:`, error);
      throw error;
    }
  },
};
