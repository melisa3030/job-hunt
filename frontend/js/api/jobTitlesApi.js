import { BASE_URL } from '../constants/constants.js';

export const JobTitlesApi = {
  getAllJobTitles: async () => {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job titles:', error);
      throw error;
    }
  },

  getJobTitleById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job title with ID ${id}:`, error);
      throw error;
    }
  },

  createJobTitle: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating job title:', error);
      throw error;
    }
  },

  updateJobTitle: async (id, data) => {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating job title with ID ${id}:`, error);
      throw error;
    }
  },

  deleteJobTitle: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting job title with ID ${id}:`, error);
      throw error;
    }
  },
};
