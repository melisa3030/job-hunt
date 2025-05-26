import { BASE_URL } from '../constants/constants.js';

export const JobTagsApi = {
  async getAllJobTags() {
    try {
      const response = await fetch(`${BASE_URL}/job_tags`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },

  async getJobTagsByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job_tags/job/${jobId}`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },
};
