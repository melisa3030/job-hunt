import { AuthApi } from './authApi.js';
import { BASE_URL } from '../constants/constants.js';

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get applications');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching applications for job ${jobId}:`, error);
      throw error;
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Error updating application status for ID ${applicationId}:`,
        error
      );
      throw error;
    }
  },
};
