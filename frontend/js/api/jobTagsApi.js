import { BASE_URL } from '../constants/constants.js';

export const JobTagsApi = {
  async getAllJobTags() {
    try {
      const response = await fetch(`${BASE_URL}/job_tags`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },

  async getJobTagsByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/job_tags/job/${jobId}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching job tags:', error);
      throw error;
    }
  },
};
