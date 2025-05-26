import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const JobTitlesApi = {
  async getAllJobTitles() {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error('Error fetching job titles:', error);
      throw error;
    }
  },

  async getJobTitleById(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error(`Error fetching job title with ID ${id}:`, error);
      throw error;
    }
  },

  async createJobTitle(jobTitleData) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitleData),
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
      console.error('Error creating job title:', error);
      throw error;
    }
  },

  async updateJobTitle(id, jobTitleData) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobTitleData),
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
      console.error(`Error updating job title with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteJobTitle(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_titles/${id}`, {
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
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
      console.error(`Error deleting job title with ID ${id}:`, error);
      throw error;
    }
  },
};
