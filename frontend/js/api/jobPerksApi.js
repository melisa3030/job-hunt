import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const JobPerksApi = {
  async getJobPerks() {
    try {
      const response = await fetch(`${BASE_URL}/job_perks`, {
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
      console.error('Error fetching job perks:', error);
      throw error;
    }
  },
};
