import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const JobsApi = {
  async getAllJobs() {
    try {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async getJobsForCurrentEmployer() {
    try {
      const response = await fetch(`${BASE_URL}/jobs_for_auth_user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching jobs for employer', error);
      throw error;
    }
  },

  async getJobById(id) {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error);
      throw error;
    }
  },

  async createJob(jobData) {
    try {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async updateJob(id, jobData) {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`Error updating job with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteJob(id) {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`Error deleting job with ID ${id}:`, error);
      throw error;
    }
  },
};
