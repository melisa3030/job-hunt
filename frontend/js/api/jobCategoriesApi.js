import { BASE_URL } from '../constants/constants.js';

export const JobCategoriesApi = {
  getAllCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/job_categories`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  }
};
