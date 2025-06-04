import { ApplicationsApi } from '../api/applicationsApi.js';
import { AuthApi } from '../api/authApi.js';
import { JobsApi } from '../api/jobsApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';
import { UsersApi } from '../api/usersApi.js';
import { extractValidatedData } from '../utils/apiResponseUtils.js';

export async function initManageEmployerApplications() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const applicationsTableBody = document.getElementById(
    'applications-table-body'
  );
  const loadingIndicator = document.getElementById('loading-applications');
  const alertsContainer = document.getElementById('alerts-container');
  const searchInput = document.getElementById('application-search');
  const statusFilter = document.getElementById('status-filter');

  let currentApplications = [];
  let filteredApplications = [];

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadApplications() {
    try {
      showLoading(true);
      applicationsTableBody.innerHTML = '';

      const user = await AuthApi.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch applications
      const applicationsResponse =
        await ApplicationsApi.getApplicationsForCompanyByCurrentEmployer();

      let applications = extractValidatedData(
        applicationsResponse,
        'applications'
      );

      // If we have applications, enhance them with additional data
      if (applications && applications.length > 0) {
        console.log('Raw applications from API:', applications);
        
        // Fetch all necessary data in parallel
        const [jobsResponse, usersResponse] = await Promise.all([
          JobsApi.getAllJobs(),
          UsersApi.getAllUsers()
        ]);

        console.log('Jobs API Response:', jobsResponse);
        console.log('Users API Response:', usersResponse);

        const jobs = extractValidatedData(jobsResponse, 'jobs');
        const users = extractValidatedData(usersResponse, 'users');

        console.log('Extracted jobs:', jobs);
        console.log('Extracted users:', users);

        // Create lookup maps for better performance
        const jobsMap = {};
        const usersMap = {};

        if (jobs) {
          jobs.forEach(job => {
            jobsMap[job.id] = job;
          });
        }

        if (users) {
          users.forEach(user => {
            usersMap[user.id] = user;
          });
        }

        console.log('Jobs Map:', jobsMap);
        console.log('Users Map:', usersMap);

        // Enhance applications with job title and applicant name
        applications = await Promise.all(applications.map(async (application) => {
          console.log('Processing application:', application);
          
          let job = jobsMap[application.job_id];
          let applicant = usersMap[application.applicant_id]; // Changed from user_id to applicant_id

          // If lookup failed, try individual API calls
          if (!job && application.job_id) {
            try {
              const jobResponse = await JobsApi.getJobById(application.job_id);
              if (jobResponse && jobResponse.success) {
                job = jobResponse.data;
                console.log('Fetched job individually:', job);
              }
            } catch (error) {
              console.warn('Failed to fetch job individually:', error);
            }
          }

          if (!applicant && application.applicant_id) { // Changed from user_id to applicant_id
            try {
              console.log('Fetching applicant data for ID:', application.applicant_id);
              const userResponse = await UsersApi.getApplicantById(application.applicant_id);
              if (userResponse && userResponse.success) {
                applicant = userResponse.data;
                console.log('Fetched user individually:', applicant);
              }
            } catch (error) {
              console.warn('Failed to fetch user individually:', error);
            }
          }

          console.log(`For application ${application.id}:`);
          console.log('  - job_id:', application.job_id, 'found job:', job);
          console.log('  - applicant_id:', application.applicant_id, 'found user:', applicant);

          // Get job title
          let jobTitle = 'N/A';
          if (job) {
            // Try different possible field names for job title
            jobTitle = job.title || job.job_title || job.name;
            
            // If job doesn't have title directly, might need to fetch job title from job_title_id
            if (!jobTitle && job.job_title_id) {
              try {
                console.log('Fetching job title for job_title_id:', job.job_title_id);
                const jobTitleResponse = await JobTitlesApi.getJobTitleById(job.job_title_id);
                if (jobTitleResponse && jobTitleResponse.success && jobTitleResponse.data) {
                  jobTitle = jobTitleResponse.data.name || jobTitleResponse.data.title || 'N/A';
                  console.log('Fetched job title:', jobTitle);
                }
              } catch (error) {
                console.error(`Failed to fetch job title ${job.job_title_id}:`, error);
              }
            }
          }

          return {
            ...application,
            job_title: jobTitle,
            applicant_name: applicant ? (applicant.name || applicant.username) : 'N/A',
            applied_at: application.applied_at || application.created_at
          };
        }));

        console.log('Enhanced applications:', applications);
      }

      currentApplications = applications || [];
      filteredApplications = [...currentApplications];

      displayApplications();
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications. Please try again.');
    } finally {
      showLoading(false);
    }
  }

  function displayApplications() {
    applicationsTableBody.innerHTML = '';

    if (filteredApplications.length === 0) {
      applicationsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No applications found</td>
        </tr>
      `;
      return;
    }

    filteredApplications
      .filter((application) => application && application.id)
      .forEach((application) => {
        const row = document.createElement('tr');
        
        // Handle date formatting more gracefully
        let appliedDate = 'N/A';
        if (application.applied_at) {
          try {
            appliedDate = new Date(application.applied_at).toLocaleDateString();
          } catch {
            console.warn('Invalid date format:', application.applied_at);
            appliedDate = 'N/A';
          }
        }

        row.innerHTML = `
          <td>${application.applicant_name || 'N/A'}</td>
          <td>${application.job_title || 'N/A'}</td>
          <td>${appliedDate}</td>
          <td>
            <span class="badge ${getStatusBadgeClass(application.status)}">${application.status}</span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-success approve-btn" data-id="${application.id}" ${application.status === 'APPROVED' ? 'disabled' : ''}>
                Approve
              </button>
              <button class="btn btn-danger reject-btn" data-id="${application.id}" ${application.status === 'REJECTED' ? 'disabled' : ''}>
                Reject
              </button>
            </div>
          </td>
        `;

        applicationsTableBody.appendChild(row);
      });

    // Add event listeners to action buttons
    document.querySelectorAll('.approve-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        updateApplicationStatus(btn.dataset.id, 'ACCEPTED')
      );
    });

    document.querySelectorAll('.reject-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        updateApplicationStatus(btn.dataset.id, 'REJECTED')
      );
    });
  }

  // ===========================
  // === Application Actions
  // ===========================
  async function updateApplicationStatus(applicationId, status) {
    try {
      const result = await ApplicationsApi.updateApplicationStatus(
        applicationId,
        status
      );

      if (result && result.success) {
        // Update local data
        const application = currentApplications.find(
          (app) => app.id.toString() === applicationId
        );
        if (application) {
          application.status = status;
        }

        displayApplications();
        showSuccess(`Application ${status.toLowerCase()} successfully!`);
      } else {
        throw new Error(result?.error || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      showError('Failed to update application status. Please try again.');
    }
  }

  // ===========================
  // === Search & Filtering
  // ===========================
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;

    filteredApplications = currentApplications.filter((application) => {
      if (!application) return false;

      const matchesSearch =
        !searchTerm ||
        (application.applicant_name &&
          application.applicant_name.toLowerCase().includes(searchTerm)) ||
        (application.job_title &&
          application.job_title.toLowerCase().includes(searchTerm));

      const matchesStatus = !statusValue || application.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    displayApplications();
  }

  // ===========================
  // === Event Listeners
  // ===========================
  function setupEventListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', handleSearch);
    }
  }

  // ===========================
  // === Utility Functions
  // ===========================
  function showLoading(isLoading) {
    if (loadingIndicator) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
  }

  function showSuccess(message) {
    if (!alertsContainer) return;

    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertsContainer.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  function showError(message) {
    if (!alertsContainer) return;

    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertsContainer.appendChild(alert);

    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'PENDING':
      default:
        return 'bg-warning';
    }
  }

  // ===========================
  // === Initialization
  // ===========================
  setupEventListeners();
  await loadApplications();
}
