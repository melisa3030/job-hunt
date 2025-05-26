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

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
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

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('Error creating perk:', error);
      throw error;
    }
  },

  async updatePerk(perkId, perkData) {
    try {
      const response = await fetch(`${BASE_URL}/perks/${perkId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perkData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('Error updating perk:', error);
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

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('Error fetching job perks:', error);
      throw error;
    }
  },

  async deletePerk(perkId) {
    try {
      const response = await fetch(`${BASE_URL}/perks/${perkId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return true; // Return true on successful deletion
    } catch (error) {
      console.error('Error deleting perk:', error);
      throw error;
    }
  },
};
