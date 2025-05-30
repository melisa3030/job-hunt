import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || `HTTP error! status: ${response.status}`
          : null,
      };
    } catch (error) {
      console.error('Error fetching job perks:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
