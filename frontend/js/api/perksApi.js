import { AuthApi } from './authApi.js';
import { BASE_URL } from '../constants/constants.js';

export const PerksApi = {
  async getAllPerks() {
    try {
      const response = await fetch(`${BASE_URL}/perks`, {
        method: 'GET',
        headers: {
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
      console.error('Error fetching perks:', error);
      throw error;
    }
  },

  async createPerk(perkData) {
    try {
      const response = await fetch(`${BASE_URL}/perks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perkData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating perk:', error);
      throw error;
    }
  },

  async getJobPerksByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job_perks/job/${jobId}`, {
        method: 'GET',
        headers: {
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
