import { BASE_URL } from '../constants/constants.js';

export const PerksApi = {
  getAllPerks: async () => {
    try {
      const response = await fetch(`${BASE_URL}/perks`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching perks:', error);
      throw error;
    }
  },
};
