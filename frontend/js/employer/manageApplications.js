import { AuthApi } from '../api/authApi.js';
import { JobsApi } from '../api/jobsApi.js';
import { ApplicationsApi } from '../api/applicationsApi.js';
import { UsersApi } from '../api/usersApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';
import { debounceFilterInput } from '../utils/debounceFilterInput.js';

export const initManageEmployerApplications = async () => {
  // DOM elements
  const applicationsTableBody = document.getElementById(
    'applications-table-body'
  );
  const noApplicationsMessage = document.getElementById(
    'no-applications-message'
  );
  const loadingIndicator = document.getElementById('loading-applications');
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('application-search');
  const applicationModal = new bootstrap.Modal(
    document.getElementById('application-modal')
  );
  const applicantDetails = document.getElementById('applicant-details');
  const jobDetails = document.getElementById('job-details');
  const applicationStatus = document.getElementById('application-status');
  const saveStatusBtn = document.getElementById('save-status-btn');
  const statusError = document.getElementById('status-error');

  // State
  let currentApplications = [];
  let currentApplicationId = null;
  let jobsData = {};
  let jobTitlesData = {};

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getStatusBadge = (status) => {
    const classes = {
      PENDING: 'bg-warning',
      ACCEPTED: 'bg-success',
      REJECTED: 'bg-danger',
    };
    return `<span class="badge ${classes[status] || 'bg-secondary'}">${status}</span>`;
  };

  // Render table with applications
  const renderApplicationsTable = (applications) => {
    // Handle empty state
    if (!applications?.length) {
      applicationsTableBody.innerHTML = '';
      noApplicationsMessage.style.display = 'block';
      loadingIndicator.style.display = 'none';
      return;
    }

    // Prepare table rows
    noApplicationsMessage.style.display = 'none';
    applicationsTableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();

    applications.forEach((app) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${app.applicant_name}</td>
        <td>${app.job_title}</td>
        <td>${formatDate(app.applied_at)}</td>
        <td>${getStatusBadge(app.status)}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-application" data-id="${app.id}">
            <i class="bi bi-eye"></i> View
          </button>
        </td>
      `;
      fragment.appendChild(row);
    });

    applicationsTableBody.appendChild(fragment);
    loadingIndicator.style.display = 'none';
  };

  // Load applications with filters
  const loadApplications = async (search = '', status = '') => {
    try {
      // Show loading state
      loadingIndicator.style.display = 'block';
      noApplicationsMessage.style.display = 'none';

      // Check authorization
      const user = AuthApi.getCachedUser();
      if (!user?.role === 'EMPLOYER') {
        throw new Error('Unauthorized access');
      }

      // Fetch data in parallel
      const [applications, jobTitles, jobs] = await Promise.all([
        ApplicationsApi.getApplicationsForCompanyByCurrentEmployer(),
        jobTitlesData.loaded
          ? Promise.resolve(jobTitlesData.items)
          : JobTitlesApi.getAllJobTitles(),
        jobsData.loaded
          ? Promise.resolve(jobsData.items)
          : JobsApi.getJobsForCurrentEmployer(),
      ]);

      // Cache job data for future use
      if (!jobTitlesData.loaded) {
        jobTitlesData = {
          loaded: true,
          items: jobTitles,
          map: new Map(
            jobTitles.map((title) => [title.id.toString(), title.name])
          ),
        };
      }

      if (!jobsData.loaded) {
        jobsData = {
          loaded: true,
          items: jobs,
          map: new Map(jobs.map((job) => [job.id.toString(), job])),
        };
      }

      // Enrich applications with job and applicant details
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          try {
            // Get job details
            const job = jobsData.map.get(app.job_id.toString());
            const jobTitle = job
              ? jobTitlesData.map.get(job.job_title_id.toString())
              : null;
            const applicant = await UsersApi.getApplicantById(app.applicant_id);

            return {
              ...app,
              job_title: jobTitle || 'Unknown Position',
              applicant_name: applicant?.name || 'Unknown Applicant',
              applicant_email: applicant?.email || 'No email',
            };
          } catch (error) {
            return {
              ...app,
              job_title: 'Data unavailable',
              applicant_name: 'Data unavailable',
              applicant_email: 'Data unavailable',
            };
          }
        })
      );

      // Store applications and apply filters
      currentApplications = enrichedApplications;
      let filteredApplications = [...enrichedApplications];

      // Apply status filter
      if (status) {
        filteredApplications = filteredApplications.filter(
          (app) => app.status === status
        );
      }

      // Apply search filter
      if (search) {
        const term = search.toLowerCase();
        filteredApplications = filteredApplications.filter((app) =>
          app.applicant_name.toLowerCase().includes(term)
        );
      }

      // Render filtered applications
      renderApplicationsTable(filteredApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      loadingIndicator.style.display = 'none';
      noApplicationsMessage.textContent =
        'Failed to load applications. Please try again.';
      noApplicationsMessage.style.display = 'block';
    }
  };

  // Show application details in modal
  const showApplicationDetails = async (applicationId) => {
    try {
      // Get application from current list
      currentApplicationId = applicationId;
      const application = currentApplications.find(
        (a) => a.id.toString() === applicationId
      );

      if (!application) {
        throw new Error('Application not found');
      }

      // Update status dropdown
      applicationStatus.value = application.status;

      // Get additional details
      const applicant = await UsersApi.getApplicantById(
        application.applicant_id
      );
      const job = await JobsApi.getJobById(application.job_id);

      // Update modal content
      applicantDetails.innerHTML = `
        <p><strong>Name:</strong> ${applicant?.name || application.applicant_name}</p>
        <p><strong>Email:</strong> ${applicant?.email || application.applicant_email}</p>
        <p><strong>Applied:</strong> ${formatDate(application.applied_at)}</p>
      `;

      jobDetails.innerHTML = `
        <p><strong>Title:</strong> ${job?.job_title || application.job_title}</p>
        <p><strong>Category:</strong> ${job?.category || 'N/A'}</p>
        <p><strong>Location:</strong> ${job?.city || 'N/A'}, ${job?.country || 'N/A'}</p>
        <p><strong>Type:</strong> ${job?.work_type || 'N/A'}</p>
      `;

      // Reset error state and show modal
      statusError.style.display = 'none';
      applicationModal.show();
    } catch (error) {
      console.error('Error loading application details:', error);
    }
  };

  // Update application status
  const updateApplicationStatus = async () => {
    try {
      statusError.style.display = 'none';

      if (!currentApplicationId) {
        throw new Error('No application selected');
      }

      const newStatus = applicationStatus.value;
      if (!newStatus) {
        throw new Error('Please select a status');
      }

      // Update status and reload
      await ApplicationsApi.updateApplicationStatus(
        currentApplicationId,
        newStatus
      );
      applicationModal.hide();
      await loadApplications(searchInput.value, statusFilter.value);
    } catch (error) {
      console.error('Error updating application status:', error);
      statusError.textContent =
        error.message || 'Failed to update status. Please try again.';
      statusError.style.display = 'block';
    }
  };

  // Set up event handlers
  applicationsTableBody.addEventListener('click', (e) => {
    if (e.target.closest('.view-application')) {
      showApplicationDetails(e.target.closest('.view-application').dataset.id);
    }
  });

  saveStatusBtn.addEventListener('click', updateApplicationStatus);
  statusFilter.addEventListener('change', () =>
    loadApplications(searchInput.value, statusFilter.value)
  );

  // Set up debounced search
  searchInput.addEventListener(
    'input',
    debounceFilterInput(
      () => loadApplications(searchInput.value, statusFilter.value),
      300
    )
  );

  // Initialize
  await loadApplications();
};
