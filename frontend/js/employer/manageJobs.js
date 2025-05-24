import { AuthApi } from '../api/authApi.js';
import { JobsApi } from '../api/jobsApi.js';
import { CategoriesApi } from '../api/categoriesApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';

export const initManageEmployerJobs = async () => {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const jobsTableBody = document.getElementById('jobs-table-body');
  const noJobsMessage = document.getElementById('no-jobs-message');
  const loadingIndicator = document.getElementById('loading-jobs');
  const addJobBtn = document.getElementById('add-job-btn');
  const searchInput = document.getElementById('job-search');
  const searchBtn = document.getElementById('search-btn');
  const statusFilter = document.getElementById('status-filter');
  const alertsContainer = document.getElementById('alerts-container');

  const jobModal = new bootstrap.Modal(document.getElementById('job-modal'));
  const deleteModal = new bootstrap.Modal(
    document.getElementById('delete-modal')
  );
  const jobForm = document.getElementById('job-form');
  const saveJobBtn = document.getElementById('save-job-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const formError = document.getElementById('form-error');

  const jobIdInput = document.getElementById('job-id');
  const jobTitleSelect = document.getElementById('job-title');
  const jobCategorySelect = document.getElementById('job-category');
  const jobCountryInput = document.getElementById('job-country');
  const jobCityInput = document.getElementById('job-city');
  const jobWorkTypeSelect = document.getElementById('job-work-type');
  const jobExperienceSelect = document.getElementById('job-experience');
  const jobSalaryInput = document.getElementById('job-salary');
  const jobExpiresInput = document.getElementById('job-expires');
  const jobDescriptionInput = document.getElementById('job-description');

  jobExpiresInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  let currentJobs = [];
  let jobToDelete = null;

  // ===========================
  // === Utility Functions
  // ===========================

  function showSuccess(message) {
    alertsContainer.innerHTML = '';
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

  // ===========================
  // === Form Handlers
  // ===========================

  function resetForm() {
    document.getElementById('job-modal-label').textContent = 'Add New Job';
    jobForm.reset();
    jobIdInput.value = '';
    formError.style.display = 'none';
  }

  // ===========================
  // === Data Loading
  // ===========================

  async function loadFormOptions() {
    try {
      const titles = await JobTitlesApi.getAllJobTitles();
      const categories = await CategoriesApi.getAllCategories();

      jobTitleSelect.innerHTML = '<option value="">Select job title</option>';
      titles.forEach((title) => {
        const option = document.createElement('option');
        option.value = title.id;
        option.textContent = title.name;
        jobTitleSelect.appendChild(option);
      });

      jobCategorySelect.innerHTML = '<option value="">Select category</option>';
      categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        jobCategorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading form options:', error);
      showError(
        'Failed to load job titles and categories. Please refresh the page.'
      );
    }
  }

  async function loadJobs(searchTerm = '', status = '') {
    try {
      loadingIndicator.style.display = 'block';
      jobsTableBody.innerHTML = '';
      noJobsMessage.style.display = 'none';

      const user = AuthApi.getCachedUser();
      if (!user || !user.company_id) {
        throw new Error('You must create a company before managing jobs');
      }

      const [jobs, jobTitles, allCategories] = await Promise.all([
        JobsApi.getJobsForCurrentEmployer(user.user_id),
        JobTitlesApi.getAllJobTitles(),
        CategoriesApi.getAllCategories(),
      ]);

      const titleMap = new Map(
        jobTitles.map((title) => [title.id, title.name])
      );
      const categoryMap = new Map(
        allCategories.map((category) => [category.id, category.name])
      );

      currentJobs = jobs.map((job) => ({
        ...job,
        title: titleMap.get(job.job_title_id) || 'Unknown Title',
        category_name: categoryMap.get(job.category_id) || 'Unknown Category',
      }));

      let filteredJobs = [...currentJobs];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(term) ||
            job.category_name.toLowerCase().includes(term) ||
            job.country.toLowerCase().includes(term) ||
            job.city.toLowerCase().includes(term)
        );
      }

      if (status) {
        const now = new Date();
        filteredJobs = filteredJobs.filter((job) => {
          const expiryDate = new Date(job.expires_at);
          return status === 'active' ? expiryDate > now : expiryDate <= now;
        });
      }

      if (filteredJobs.length === 0) {
        noJobsMessage.style.display = 'block';
      } else {
        filteredJobs.forEach((job) => {
          const row = document.createElement('tr');
          const postedDate = new Date(job.created_at).toLocaleDateString();
          const expiresDate = new Date(job.expires_at).toLocaleDateString();
          const isExpired = new Date(job.expires_at) < new Date();

          row.innerHTML = `
                      <td>${job.title}</td>
                      <td>${job.category_name}</td>
                      <td>${job.experience_level}</td>
                      <td>${job.city}, ${job.country}</td>
                      <td>${postedDate}</td>
                      <td>
                        <span class="badge ${isExpired ? 'bg-danger' : 'bg-success'}">${expiresDate}</span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-primary edit-job" data-id="${job.id}">Edit</button>
                          <button class="btn btn-danger delete-job" data-id="${job.id}">Delete</button>
                        </div>
                      </td>
                    `;
          jobsTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-job').forEach((btn) => {
          btn.addEventListener('click', () => editJob(btn.dataset.id));
        });

        document.querySelectorAll('.delete-job').forEach((btn) => {
          btn.addEventListener('click', () => {
            jobToDelete = btn.dataset.id;
            deleteModal.show();
          });
        });
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      if (error.message === 'You must create a company before managing jobs') {
        showError('Please create a company before you can manage jobs.');
      } else {
        showError('Failed to load jobs. Please try again.');
      }
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }

  // ===========================
  // === Job Actions
  // ===========================

  function editJob(jobId) {
    const job = currentJobs.find((j) => j.id.toString() === jobId.toString());
    if (!job) return;

    document.getElementById('job-modal-label').textContent = 'Edit Job';
    jobIdInput.value = job.id;
    jobTitleSelect.value = job.job_title_id;
    jobCategorySelect.value = job.category_id;
    jobCountryInput.value = job.country;
    jobCityInput.value = job.city;
    jobWorkTypeSelect.value = job.work_type;
    jobExperienceSelect.value = job.experience_level;
    jobSalaryInput.value = job.salary;

    const expiresDate = new Date(job.expires_at);
    const year = expiresDate.getFullYear();
    const month = String(expiresDate.getMonth() + 1).padStart(2, '0');
    const day = String(expiresDate.getDate()).padStart(2, '0');
    jobExpiresInput.value = `${year}-${month}-${day}`;

    jobDescriptionInput.value = job.description;
    formError.style.display = 'none';
    jobModal.show();
  }

  async function deleteJob() {
    if (!jobToDelete) return;
    try {
      await JobsApi.deleteJob(jobToDelete);
      deleteModal.hide();
      await loadJobs(searchInput.value, statusFilter.value);
      showSuccess('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      deleteModal.hide();
      showError('Failed to delete job. Please try again.');
    }
    jobToDelete = null;
  }

  async function saveJob() {
    try {
      formError.style.display = 'none';
      if (!jobForm.checkValidity()) {
        jobForm.reportValidity();
        return;
      }
      const user = AuthApi.getCachedUser();
      if (!user || !user.company_id) {
        throw new Error('You must create a company before posting jobs');
      }
      if (!jobExpiresInput.value) {
        throw new Error('Expiration date is required');
      }
      const expiresDate = new Date(jobExpiresInput.value);
      if (isNaN(expiresDate.getTime())) {
        throw new Error('Invalid expiration date');
      }
      const month = String(expiresDate.getMonth() + 1).padStart(2, '0');
      const day = String(expiresDate.getDate()).padStart(2, '0');
      const year = expiresDate.getFullYear();
      const formattedExpiresAt = `${month}/${day}/${year}`;

      const jobData = {
        job_title_id: parseInt(jobTitleSelect.value),
        company_id: user.company_id,
        category_id: parseInt(jobCategorySelect.value),
        description: jobDescriptionInput.value.trim(),
        city: jobCityInput.value.trim(),
        country: jobCountryInput.value.trim(),
        work_type: jobWorkTypeSelect.value,
        experience_level: jobExperienceSelect.value,
        salary: jobSalaryInput.value ? parseFloat(jobSalaryInput.value) : null,
        expires_at: formattedExpiresAt,
      };

      const jobId = jobIdInput.value;
      if (jobId) {
        await JobsApi.updateJob(jobId, jobData);
      } else {
        await JobsApi.createJob(jobData);
      }
      jobModal.hide();
      await loadJobs(searchInput.value, statusFilter.value);
      const action = jobId ? 'updated' : 'created';
      showSuccess(`Job successfully ${action}!`);
    } catch (error) {
      console.error('Error saving job:', error);
      formError.textContent =
        error.message || 'Failed to save job. Please try again.';
      formError.style.display = 'block';
    }
  }

  // ===========================
  // === Event Listeners
  // ===========================

  function setupEventListeners() {
    addJobBtn.addEventListener('click', () => {
      resetForm();
      jobModal.show();
    });
    saveJobBtn.addEventListener('click', saveJob);
    confirmDeleteBtn.addEventListener('click', deleteJob);
    searchBtn.addEventListener('click', () => {
      loadJobs(searchInput.value, statusFilter.value);
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loadJobs(searchInput.value, statusFilter.value);
      }
    });
    statusFilter.addEventListener('change', () => {
      loadJobs(searchInput.value, statusFilter.value);
    });
  }

  // ===========================
  // === Initialization
  // ===========================

  await loadFormOptions();
  await loadJobs();
  setupEventListeners();
};
