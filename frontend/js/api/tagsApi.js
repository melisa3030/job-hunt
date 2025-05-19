import { BASE_URL } from '../constants/constants.js';

export const TagsApi = {
  getAllTags: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tags`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }
};