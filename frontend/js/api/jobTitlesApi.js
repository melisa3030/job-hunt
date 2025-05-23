import { BASE_URL } from '../constants/constants.js';

export const JobTitlesApi = {
  async getAllJobTitles() {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching job titles:', error);
      throw error;
    }
  },

  async getJobTitleById(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job title with ID ${id}:`, error);
      throw error;
    }
  },

  async createJobTitle(data) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating job title:', error);
      throw error;
    }
  },

  async updateJobTitle(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating job title with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteJobTitle(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting job title with ID ${id}:`, error);
      throw error;
    }
  },
};
