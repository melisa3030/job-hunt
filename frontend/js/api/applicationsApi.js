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
  async getApplicationsByCurrentUser() {
    try {
      const response = await fetch(
        `${BASE_URL}/applications_for_current_auth_user`,
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

      if (!response.ok) {
        return {
          success: false,
          data: null,
          error: data.message || 'Failed to get applications',
        };
      }

      // If we have applications data, enhance it with job details
      if (data && Array.isArray(data)) {
        try {
          // Import required APIs
          const { JobsApi } = await import('./jobsApi.js');
          const { JobTitlesApi } = await import('./jobTitlesApi.js');
          const { CompaniesApi } = await import('./companiesApi.js');

          // Fetch all necessary data in parallel
          const [jobsResponse, jobTitlesResponse, companiesResponse] =
            await Promise.all([
              JobsApi.getAllJobs(),
              JobTitlesApi.getAllJobTitles(),
              CompaniesApi.getAllCompanies(),
            ]);

          // Create lookup maps for quick access
          const jobs =
            jobsResponse.success && jobsResponse.data
              ? new Map(jobsResponse.data.map((job) => [job.id, job]))
              : new Map();

          const jobTitles =
            jobTitlesResponse.success && jobTitlesResponse.data
              ? new Map(
                  jobTitlesResponse.data.map((title) => [title.id, title])
                )
              : new Map();

          const companies =
            companiesResponse.success && companiesResponse.data
              ? new Map(
                  companiesResponse.data.map((company) => [company.id, company])
                )
              : new Map();

          // Enhance each application with job details
          const enhancedApplications = data.map((application) => {
            const job = jobs.get(parseInt(application.job_id));

            if (!job) {
              return {
                ...application,
                job_title: 'Unknown Job',
                company_name: 'Unknown Company',
                city: 'N/A',
                country: 'N/A',
                work_type: 'N/A',
                experience_level: 'N/A',
                description: 'Job details not available',
              };
            }

            const jobTitle = jobTitles.get(job.job_title_id);
            const company = companies.get(job.company_id);

            return {
              ...application,
              job_title: jobTitle?.name || 'Unknown Title',
              company_name: company?.name || 'Unknown Company',
              city: job.city || 'N/A',
              country: job.country || 'N/A',
              work_type: job.work_type || 'N/A',
              experience_level: job.experience_level || 'N/A',
              description: job.description || 'No description available',
              salary: job.salary,
            };
          });

          return {
            success: true,
            data: enhancedApplications,
          };
        } catch (enhanceError) {
          console.error('Error enhancing applications data:', enhanceError);
          // Return original data if enhancement fails
          return {
            success: true,
            data: data,
          };
        }
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error fetching applications for current user:', error);
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

  async createApplication(applicationData) {
    try {
      const response = await fetch(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
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
      console.error('Error creating application:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
