import { BASE_URL } from '../constants/constants.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

export const JobTagsApi = {
  async getAllJobTags() {
    try {
      const response = await fetch(`${BASE_URL}/job_tags`);
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
      console.error('Error fetching job tags:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getJobTagsByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job_tags/job/${jobId}`);
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
      console.error('Error fetching job tags:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
