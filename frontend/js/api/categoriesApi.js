import { AuthApi } from './authApi.js';
import { BASE_URL } from '../constants/constants.js';

export const CategoriesApi = {
  async getAllCategories() {
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
        throw new Error('Failed to get categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};
