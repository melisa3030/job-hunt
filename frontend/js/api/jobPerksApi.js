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
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching job perks:', error);
      throw error;
    }
  },
};
