import { AuthApi } from './authApi.js';
import { BASE_URL } from '../constants/constants.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

export const BookmarksApi = {
  async getAllBookmarkedJobs() {
    try {
      const response = await fetch(`${BASE_URL}/bookmarked_jobs`, {
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
      console.error('Error fetching bookmarked jobs:', error.message);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getBoomarkedJobsByUserId(userId) {
    try {
      const response = await fetch(`${BASE_URL}/bookmarked_jobs/${userId}`, {
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
      console.error(
        'Error fetching bookmarked jobs by user ID:',
        error.message
      );
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getBookmarkedJobsForCurrentUser() {
    try {
      const response = await fetch(
        `${BASE_URL}/bookmarked_jobs_for_auth_user`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${AuthApi.getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

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
      console.error(
        'Error fetching bookmarked jobs for current user:',
        error.message
      );
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async createBookmark(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/bookmarked_jobs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId }),
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
      console.error('Error bookmarking job:', error.message);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async deleteBookmark(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/bookmarked_jobs`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok
          ? data || { message: 'Bookmark deleted successfully' }
          : null,
        error: !response.ok
          ? data?.message || `HTTP error! status: ${response.status}`
          : null,
      };
    } catch (error) {
      console.error('Error deleting bookmark:', error.message);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
