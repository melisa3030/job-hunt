import { AuthApi } from './authApi.js';
import { BASE_URL } from '../constants/constants.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

export const ApplicationsApi = {
  async getApplicationsByEmployerId(employerId) {
    try {
      const response = await fetch(
        `${BASE_URL}/applications_for_company_by_employer_id/${employerId}`,
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
      console.error('Error fetching applications:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getApplicationsForCompanyByCurrentEmployer() {
    try {
      const response = await fetch(
        `${BASE_URL}/applications_for_company_by_current_employer`,
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
          ? data.message || 'Failed to get applications'
          : null,
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getApplicationsByJobId(jobId) {
    try {
      const response = await fetch(`${BASE_URL}/applications/job/${jobId}`, {
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
      console.error(`Error fetching applications for job ${jobId}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await fetch(
        `${BASE_URL}/applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${AuthApi.getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
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
        `Error updating application status for ID ${applicationId}:`,
        error
      );
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
