/* global bootstrap */
import { ApplicationsApi } from '../api/applicationsApi.js';
import { AuthApi } from '../api/authApi.js';

export async function initMyApplications() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const applicationsTableBody = document.getElementById(
    'applications-table-body'
  );
  const alertsContainer = document.getElementById('alerts-container');
  const loadingIndicator = document.getElementById('loading-applications');
  const searchInput = document.getElementById('application-search');
  const statusFilter = document.getElementById('status-filter');
  const searchBtn = document.getElementById('search-btn');

  const applicationModal = new bootstrap.Modal(
    document.getElementById('application-modal')
  );

  let currentApplications = [];
  let filteredApplications = [];

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
    statusFilter?.addEventListener('change', handleSearch);
  }

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
        await ApplicationsApi.getApplicationsByCurrentUser();

      if (applicationsResponse && applicationsResponse.success) {
        currentApplications = applicationsResponse.data || [];
        filteredApplications = [...currentApplications];
        renderApplications();
      } else {
        throw new Error(
          applicationsResponse?.error || 'Failed to load applications'
        );
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      showError('Failed to load applications. Please try again.');
      applicationsTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center text-danger">Failed to load applications</td></tr>';
    } finally {
      showLoading(false);
    }
  }

  function renderApplications() {
    applicationsTableBody.innerHTML = '';

    if (filteredApplications.length === 0) {
      applicationsTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center">No applications found</td></tr>';
      return;
    }

    filteredApplications.forEach((application, index) => {
      const row = document.createElement('tr');
      const appliedDate = new Date(application.applied_at).toLocaleDateString();

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${application.job_title || 'N/A'}</td>
        <td>${application.company_name || 'N/A'}</td>
        <td>${appliedDate}</td>
        <td>
          <span class="badge ${getStatusBadgeClass(application.status)}">${application.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-primary view-btn" data-id="${application.id}">
            <i class="fas fa-eye"></i> View
          </button>
        </td>
      `;

      applicationsTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => viewApplication(btn.dataset.id));
    });
  }

  // ===========================
  // === Application Actions
  // ===========================
  async function viewApplication(applicationId) {
    try {
      const application = currentApplications.find(
        (app) => app.id.toString() === applicationId
      );

      if (!application) {
        showError('Application not found');
        return;
      }

      const applicationDetails = document.getElementById('application-details');
      const appliedDate = new Date(application.applied_at).toLocaleDateString();

      applicationDetails.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h6>Job Information</h6>
            <p><strong>Job Title:</strong> ${application.job_title || 'N/A'}</p>
            <p><strong>Company:</strong> ${application.company_name || 'N/A'}</p>
            <p><strong>Location:</strong> ${application.city || 'N/A'}, ${application.country || 'N/A'}</p>
            <p><strong>Work Type:</strong> ${application.work_type || 'N/A'}</p>
            <p><strong>Experience Level:</strong> ${application.experience_level || 'N/A'}</p>
          </div>
          <div class="col-md-6">
            <h6>Application Information</h6>
            <p><strong>Applied Date:</strong> ${appliedDate}</p>
            <p><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(application.status)}">${application.status}</span></p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <h6>Job Description</h6>
            <p>${application.description || 'No description available'}</p>
          </div>
        </div>
      `;

      applicationModal.show();
    } catch (error) {
      console.error('Error viewing application:', error);
      showError('Failed to load application details');
    }
  }

  // ===========================
  // === Search & Filtering
  // ===========================
  function handleSearch() {
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';
    const statusValue = statusFilter?.value || '';

    filteredApplications = currentApplications.filter((application) => {
      if (!application) return false;

      const matchesSearch =
        !searchTerm ||
        (application.job_title &&
          application.job_title.toLowerCase().includes(searchTerm)) ||
        (application.company_name &&
          application.company_name.toLowerCase().includes(searchTerm));

      const matchesStatus = !statusValue || application.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    renderApplications();
  }

  // ===========================
  // === Utility Functions
  // ===========================
  function showLoading(isLoading) {
    if (loadingIndicator) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
  }

  function showError(message) {
    if (!alertsContainer) return;

    alertsContainer.innerHTML = '';
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
  await loadApplications();
  setupEventListeners();
}
