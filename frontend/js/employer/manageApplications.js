import { ApplicationsApi } from '../api/applicationsApi.js';
import { AuthApi } from '../api/authApi.js';
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

      const applicationsResponse =
        await ApplicationsApi.getApplicationsForCompanyByCurrentEmployer();

      currentApplications = extractValidatedData(
        applicationsResponse,
        'applications'
      );
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
      .forEach((application, index) => {
        const row = document.createElement('tr');
        const appliedDate = new Date(
          application.applied_at
        ).toLocaleDateString();

        row.innerHTML = `
          <td>${index + 1}</td>
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
        updateApplicationStatus(btn.dataset.id, 'APPROVED')
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
      case 'APPROVED':
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
