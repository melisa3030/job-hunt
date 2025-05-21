import { BASE_URL } from '../constants/constants.js';

export const JobTagsApi = {
  async getAllJobTags() {
    try {
      const response = await fetch(`${BASE_URL}/job_tags`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },

  async getJobTagsByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job_tags/job/${jobId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },
};
