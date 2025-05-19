import { BASE_URL } from '../constants/constants.js';

export const JobsApi = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/jobs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  getJobById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching job with ID ${id}:`, error);
      throw error;
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating job with ID ${id}:`, error);
      throw error;
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting job with ID ${id}:`, error);
      throw error;
    }
  }
};

// Example usage:
// Fetch all jobs
const fetchJobs = async () => {
  try {
    const jobs = await JobsApi.getAllJobs();
    console.log('All jobs:', jobs);
    return jobs;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    // Handle error appropriately (e.g., show error message to user)
  }
};