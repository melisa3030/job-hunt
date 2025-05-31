/* global bootstrap */
import { AuthApi } from '../api/authApi.js';
import { JobsApi } from '../api/jobsApi.js';
import { JobCategoriesApi } from '../api/jobCategoriesApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';
import { CompaniesApi } from '../api/companiesApi.js';
import { PerksApi } from '../api/perksApi.js';
import { TagsApi } from '../api/tagsApi.js';
import { JobPerksApi } from '../api/jobPerksApi.js';
import { JobTagsApi } from '../api/jobTagsApi.js';

// TODO: Add perks and tags to the job creation and editing process
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

  const perksContainer = document.getElementById('perks-container');
  const tagsContainer = document.getElementById('tags-container');

  let currentJobs = [];
  let jobToDelete = null;

  let currentPerks = [];
  let currentTags = [];
  let selectedPerks = new Set();
  let selectedTags = new Set();

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
      const titlesResponse = await JobTitlesApi.getAllJobTitles();
      const categoriesResponse = await JobCategoriesApi.getAllJobCategories();

      // Validate API responses
      if (!titlesResponse || !titlesResponse.success || !titlesResponse.data) {
        throw new Error('Failed to load job titles');
      }
      if (
        !categoriesResponse ||
        !categoriesResponse.success ||
        !categoriesResponse.data
      ) {
        throw new Error('Failed to load job categories');
      }

      const titles = Array.isArray(titlesResponse.data)
        ? titlesResponse.data
        : Array.isArray(titlesResponse.data.data)
          ? titlesResponse.data.data
          : [];
      const categories = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : Array.isArray(categoriesResponse.data.data)
          ? categoriesResponse.data.data
          : [];

      jobTitleSelect.innerHTML = '<option value="">Select job title</option>';
      titles.forEach((title) => {
        if (title && title.id && title.name) {
          const option = document.createElement('option');
          option.value = title.id;
          option.textContent = title.name;
          jobTitleSelect.appendChild(option);
        }
      });

      jobCategorySelect.innerHTML = '<option value="">Select category</option>';
      categories.forEach((category) => {
        if (category && category.id && category.name) {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          jobCategorySelect.appendChild(option);
        }
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

      const user = await AuthApi.getCurrentUser();

      const companyResponse = await CompaniesApi.getCompanyByEmployerId(
        user.id
      );

      if (
        !companyResponse ||
        !companyResponse.success ||
        !companyResponse.data
      ) {
        alertsContainer.style.display = 'block';
        alertsContainer.innerHTML = `
          <div class="alert alert-warning">
            You have not created a company yet. 
            <a href="/employer/company" class="alert-link">Create a company</a> to manage jobs.
          </div>
        `;
        loadingIndicator.style.display = 'none';
        return;
      }

      const [jobsResponse, jobTitlesResponse, categoriesResponse] =
        await Promise.all([
          JobsApi.getJobsForCurrentEmployer(user.id),
          JobTitlesApi.getAllJobTitles(),
          JobCategoriesApi.getAllJobCategories(),
        ]);

      // Validate all API responses
      if (!jobsResponse || !jobsResponse.success) {
        throw new Error(jobsResponse?.error || 'Failed to load jobs');
      }
      if (!jobTitlesResponse || !jobTitlesResponse.success) {
        throw new Error(
          jobTitlesResponse?.error || 'Failed to load job titles'
        );
      }
      if (!categoriesResponse || !categoriesResponse.success) {
        throw new Error(
          categoriesResponse?.error || 'Failed to load categories'
        );
      }

      const jobs = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : Array.isArray(jobsResponse.data?.data)
          ? jobsResponse.data.data
          : [];
      const jobTitles = Array.isArray(jobTitlesResponse.data)
        ? jobTitlesResponse.data
        : Array.isArray(jobTitlesResponse.data?.data)
          ? jobTitlesResponse.data.data
          : [];
      const allCategories = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : Array.isArray(categoriesResponse.data?.data)
          ? categoriesResponse.data.data
          : [];

      const titleMap = new Map(
        jobTitles
          .filter((title) => title && title.id && title.name)
          .map((title) => [title.id, title.name])
      );
      const categoryMap = new Map(
        allCategories
          .filter((category) => category && category.id && category.name)
          .map((category) => [category.id, category.name])
      );

      currentJobs = jobs
        .filter((job) => job && job.id)
        .map((job) => ({
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

          // Check if job expires today, is expired, or is still active
          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const jobExpiryDate = new Date(job.expires_at);
          const expiryDateOnly = new Date(
            jobExpiryDate.getFullYear(),
            jobExpiryDate.getMonth(),
            jobExpiryDate.getDate()
          );

          let badgeClass;
          if (expiryDateOnly < today) {
            badgeClass = 'bg-danger'; // Expired (red)
          } else if (expiryDateOnly.getTime() === today.getTime()) {
            badgeClass = 'bg-warning'; // Expires today (yellow)
          } else {
            badgeClass = 'bg-success'; // Active (green)
          }

          row.innerHTML = `
                      <td>${job.title}</td>
                      <td>${job.category_name}</td>
                      <td>${job.experience_level}</td>
                      <td>${job.city}, ${job.country}</td>
                      <td>${postedDate}</td>
                      <td>
                        <span class="badge ${badgeClass}">${expiresDate}</span>
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
      showError(error.message || 'Failed to load jobs');
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

    // Load and display perks and tags for the job
    loadJobPerksAndTags(job.id);
  }

  async function deleteJob() {
    if (!jobToDelete) return;
    try {
      const result = await JobsApi.deleteJob(jobToDelete);

      if (result && result.success) {
        deleteModal.hide();
        await loadJobs(searchInput.value, statusFilter.value);
        showSuccess('Job deleted successfully!');
      } else {
        throw new Error(result?.error || 'Failed to delete job');
      }
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
      let result;

      if (jobId) {
        result = await JobsApi.updateJob(jobId, jobData);
      } else {
        result = await JobsApi.createJob(jobData);
      }

      if (result && result.success) {
        jobModal.hide();
        await loadJobs(searchInput.value, statusFilter.value);
        const action = jobId ? 'updated' : 'created';
        showSuccess(`Job successfully ${action}!`);
      } else {
        throw new Error(result?.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      formError.textContent =
        error.message || 'Failed to save job. Please try again.';
      formError.style.display = 'block';
    }
  }

  // ===========================
  // === Perks and Tags Management
  // ===========================
  async function loadPerksAndTags() {
    try {
      const [perksResponse, tagsResponse] = await Promise.all([
        PerksApi.getAllPerks(),
        TagsApi.getAllTags(),
      ]);

      if (perksResponse.success) {
        currentPerks = perksResponse.data || [];
        renderPerksSelection();
      }

      if (tagsResponse.success) {
        currentTags = tagsResponse.data || [];
        renderTagsSelection();
      }
    } catch (error) {
      console.error('Error loading perks and tags:', error);
    }
  }

  function renderPerksSelection() {
    if (!perksContainer) return;

    if (currentPerks.length === 0) {
      perksContainer.innerHTML =
        '<div class="text-muted">No perks available</div>';
      return;
    }

    const perksHTML = currentPerks
      .map(
        (perk) => `
        <div class="form-check form-check-inline">
          <input 
            class="form-check-input perk-checkbox" 
            type="checkbox" 
            id="perk-${perk.id}" 
            value="${perk.id}"
            ${selectedPerks.has(perk.id) ? 'checked' : ''}
          >
          <label class="form-check-label" for="perk-${perk.id}">
            ${perk.name}
          </label>
        </div>
      `
      )
      .join('');

    perksContainer.innerHTML = perksHTML;

    // Add event listeners
    document.querySelectorAll('.perk-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const perkId = parseInt(e.target.value);
        if (e.target.checked) {
          selectedPerks.add(perkId);
        } else {
          selectedPerks.delete(perkId);
        }
      });
    });
  }

  function renderTagsSelection() {
    if (!tagsContainer) return;

    if (currentTags.length === 0) {
      tagsContainer.innerHTML =
        '<div class="text-muted">No tags available</div>';
      return;
    }

    const tagsHTML = currentTags
      .map(
        (tag) => `
        <div class="form-check form-check-inline">
          <input 
            class="form-check-input tag-checkbox" 
            type="checkbox" 
            id="tag-${tag.id}" 
            value="${tag.id}"
            ${selectedTags.has(tag.id) ? 'checked' : ''}
          >
          <label class="form-check-label" for="tag-${tag.id}">
            ${tag.name}
          </label>
        </div>
      `
      )
      .join('');

    tagsContainer.innerHTML = tagsHTML;

    // Add event listeners
    document.querySelectorAll('.tag-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const tagId = parseInt(e.target.value);
        if (e.target.checked) {
          selectedTags.add(tagId);
        } else {
          selectedTags.delete(tagId);
        }
      });
    });
  }

  async function loadJobPerksAndTags(jobId) {
    if (!jobId) {
      selectedPerks.clear();
      selectedTags.clear();
      renderPerksSelection();
      renderTagsSelection();
      return;
    }

    try {
      const [jobPerksResponse, jobTagsResponse] = await Promise.all([
        JobPerksApi.getJobPerksByJobId(jobId),
        JobTagsApi.getJobTagsByJobId(jobId),
      ]);

      selectedPerks.clear();
      selectedTags.clear();

      if (jobPerksResponse.success && jobPerksResponse.data) {
        jobPerksResponse.data.forEach((jobPerk) => {
          selectedPerks.add(jobPerk.perk_id);
        });
      }

      if (jobTagsResponse.success && jobTagsResponse.data) {
        jobTagsResponse.data.forEach((jobTag) => {
          selectedTags.add(jobTag.tag_id);
        });
      }

      renderPerksSelection();
      renderTagsSelection();
    } catch (error) {
      console.error('Error loading job perks and tags:', error);
    }
  }

  async function saveJobPerksAndTags(jobId) {
    try {
      // Get current job perks and tags
      const [currentJobPerksResponse, currentJobTagsResponse] =
        await Promise.all([
          JobPerksApi.getJobPerksByJobId(jobId),
          JobTagsApi.getJobTagsByJobId(jobId),
        ]);

      const currentJobPerks = new Set();
      const currentJobTags = new Set();

      if (currentJobPerksResponse.success && currentJobPerksResponse.data) {
        currentJobPerksResponse.data.forEach((jobPerk) => {
          currentJobPerks.add(jobPerk.perk_id);
        });
      }

      if (currentJobTagsResponse.success && currentJobTagsResponse.data) {
        currentJobTagsResponse.data.forEach((jobTag) => {
          currentJobTags.add(jobTag.tag_id);
        });
      }

      // Handle perks
      const perksToAdd = [...selectedPerks].filter(
        (perkId) => !currentJobPerks.has(perkId)
      );
      const perksToRemove = [...currentJobPerks].filter(
        (perkId) => !selectedPerks.has(perkId)
      );

      // Handle tags
      const tagsToAdd = [...selectedTags].filter(
        (tagId) => !currentJobTags.has(tagId)
      );
      const tagsToRemove = [...currentJobTags].filter(
        (tagId) => !selectedTags.has(tagId)
      );

      const promises = [];

      // Add new perks
      perksToAdd.forEach((perkId) => {
        promises.push(
          JobPerksApi.createJobPerk({ job_id: jobId, perk_id: perkId })
        );
      });

      // Remove perks
      perksToRemove.forEach((perkId) => {
        promises.push(JobPerksApi.deleteJobPerk(jobId, perkId));
      });

      // Add new tags
      tagsToAdd.forEach((tagId) => {
        promises.push(
          JobTagsApi.createJobTag({ job_id: jobId, tag_id: tagId })
        );
      });

      // Remove tags
      tagsToRemove.forEach((tagId) => {
        promises.push(JobTagsApi.deleteJobTag(jobId, tagId));
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving job perks and tags:', error);
      throw error;
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

    // Initialize perks and tags when modal opens
    addJobBtn?.addEventListener('click', () => {
      selectedPerks.clear();
      selectedTags.clear();
      renderPerksSelection();
      renderTagsSelection();
    });

    // Enhanced save job function
    saveJobBtn?.addEventListener('click', async () => {
      // ... existing job save logic ...

      // After job is created/updated, save perks and tags
      const jobId = jobIdInput?.value;
      if (jobId) {
        try {
          await saveJobPerksAndTags(parseInt(jobId));
        } catch (error) {
          console.error('Error saving perks and tags:', error);
          // Show error but don't fail the entire operation
        }
      }
    });
  }

  // ===========================
  // === Initialization
  // ===========================

  await loadFormOptions();
  await loadJobs();
  await loadPerksAndTags();
  setupEventListeners();
};
