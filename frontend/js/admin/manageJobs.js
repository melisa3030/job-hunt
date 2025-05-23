import { JobsApi } from '../api/jobsApi.js';
import { CompaniesApi } from '../api/companiesApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';
import { JobCategoriesApi } from '../api/jobCategoriesApi.js';

let currentJobs = [];
let filteredJobs = [];
let currentPage = 1;
const itemsPerPage = 10;
let companies = new Map();
let jobTitles = new Map();
let jobCategories = new Map();

export async function initManageAdminJobs() {
  setupEventListeners();
  await loadData();
}

function setupEventListeners() {
  const searchInput = document.getElementById('job-search');
  searchInput.addEventListener('input', handleSearch);

  const addJobBtn = document.getElementById('add-job-btn');
  addJobBtn.addEventListener('click', function () {
    openJobModal();
  });

  document.querySelectorAll('.close-modal').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });

  const jobForm = document.getElementById('job-form');
  jobForm.addEventListener('submit', handleJobSubmit);

  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  confirmDeleteBtn.addEventListener('click', confirmDeleteJob);
}

async function loadData() {
  showLoading(true);

  try {
    let jobsResponse;
    try {
      jobsResponse = await JobsApi.getAllJobs();
      console.log('Jobs API response:', jobsResponse);
    } catch (jobsError) {
      console.error('Jobs API error:', jobsError);
      throw new Error('Failed to load jobs data');
    }

    let companiesResponse, jobTitlesResponse, jobCategoriesResponse;
    try {
      [companiesResponse, jobTitlesResponse, jobCategoriesResponse] =
        await Promise.all([
          CompaniesApi.getAllCompanies(),
          JobTitlesApi.getAllJobTitles(),
          JobCategoriesApi.getAllJobCategories(),
        ]);
    } catch (dataError) {
      console.error('Error loading supporting data:', dataError);
    }

    // Process companies into lookup Map
    if (companiesResponse && companiesResponse.data) {
      companiesResponse.data.forEach((company) => {
        companies.set(company.id, company);
      });
    } else if (companiesResponse && Array.isArray(companiesResponse)) {
      companiesResponse.forEach((company) => {
        companies.set(company.id, company);
      });
    }

    // Process job titles into lookup Map
    if (jobTitlesResponse && jobTitlesResponse.data) {
      jobTitlesResponse.data.forEach((title) => {
        jobTitles.set(title.id, title);
      });
    } else if (jobTitlesResponse && Array.isArray(jobTitlesResponse)) {
      jobTitlesResponse.forEach((title) => {
        jobTitles.set(title.id, title);
      });
    }

    // Process job categories into lookup Map
    if (jobCategoriesResponse && jobCategoriesResponse.data) {
      jobCategoriesResponse.data.forEach((category) => {
        jobCategories.set(category.id, category);
      });
    } else if (jobCategoriesResponse && Array.isArray(jobCategoriesResponse)) {
      jobCategoriesResponse.forEach((category) => {
        jobCategories.set(category.id, category);
      });
    }

    // Extract jobs array from response, handling different formats
    if (jobsResponse && jobsResponse.data) {
      currentJobs = jobsResponse.data;
    } else if (jobsResponse && Array.isArray(jobsResponse)) {
      currentJobs = jobsResponse;
    } else if (jobsResponse) {
      // Some other valid response but not in expected format
      console.warn('Unexpected jobs response format:', jobsResponse);
      currentJobs = [];
    } else {
      // No valid response
      currentJobs = [];
    }

    filteredJobs = [...currentJobs];
    displayJobs(currentPage);
    setupPagination();

    // Populate company select in job form
    const companySelect = document.getElementById('job-company');
    if (companySelect) {
      companySelect.innerHTML = '<option value="">Select a company</option>';

      const companyList = Array.from(companies.values());
      if (companyList.length > 0) {
        companyList
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .forEach((company) => {
            const option = document.createElement('option');
            option.value = company.id;
            option.textContent = company.name || `Company ID: ${company.id}`;
            companySelect.appendChild(option);
          });
      } else {
        // Add a disabled option indicating no companies
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No companies available';
        companySelect.appendChild(option);
      }
    }

    // Populate job title select in job form
    const jobTitleSelect = document.getElementById('job-title');
    if (jobTitleSelect) {
      jobTitleSelect.innerHTML = '<option value="">Select a job title</option>';

      const titleList = Array.from(jobTitles.values());
      if (titleList.length > 0) {
        titleList
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .forEach((title) => {
            const option = document.createElement('option');
            option.value = title.id;
            option.textContent = title.name || `Title ID: ${title.id}`;
            jobTitleSelect.appendChild(option);
          });
      } else {
        // Add a disabled option indicating no job titles
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No job titles available';
        jobTitleSelect.appendChild(option);
      }
    }

    // Populate job category select in job form
    const jobCategorySelect = document.getElementById('job-category');
    if (jobCategorySelect) {
      jobCategorySelect.innerHTML =
        '<option value="">Select a category</option>';

      const categoryList = Array.from(jobCategories.values());
      if (categoryList.length > 0) {
        categoryList
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name || `Category ID: ${category.id}`;
            jobCategorySelect.appendChild(option);
          });
      } else {
        // Add a disabled option indicating no categories
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No categories available';
        jobCategorySelect.appendChild(option);
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
    showError('Failed to load jobs. Please try again later: ' + error.message);
  } finally {
    showLoading(false);
  }
}

function displayJobs(page) {
  const jobsTableBody = document.getElementById('jobs-table-body');
  if (!jobsTableBody) return;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(start, end);

  jobsTableBody.innerHTML = '';

  if (paginatedJobs.length === 0) {
    jobsTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">No jobs found</td>
      </tr>
    `;
    return;
  }

  paginatedJobs.forEach((job, index) => {
    const companyName =
      companies.get(job.company_id)?.name || 'Unknown Company';
    const jobTitle =
      jobTitles.get(job.job_title_id)?.name || 'Unknown Position';
    const categoryName =
      jobCategories.get(job.category_id)?.name || 'Uncategorized';
    const expiryDate = new Date(job.expires_at).toLocaleDateString();

    // Truncate description if too long
    const truncatedDescription =
      job.description && job.description.length > 50
        ? job.description.substring(0, 50) + '...'
        : job.description || 'No description';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${job.id}</td>
      <td>${companyName}</td>
      <td>${jobTitle}</td>
      <td>${categoryName}</td>
      <td>${job.city}, ${job.country}</td>
      <td>${job.work_type}</td>
      <td>${job.experience_level}</td>
      <td>$${job.salary?.toLocaleString() || 'N/A'}</td>
      <td>${truncatedDescription}</td>
      <td>${expiryDate}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-job-btn" data-job-id="${job.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger delete-job-btn" data-job-id="${job.id}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;

    jobsTableBody.appendChild(row);
  });

  // Add event listeners to the edit and delete buttons
  document.querySelectorAll('.edit-job-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const jobId = button.getAttribute('data-job-id');
      const job = currentJobs.find((j) => j.id.toString() === jobId);
      if (job) {
        openJobModal(job);
      }
    });
  });

  document.querySelectorAll('.delete-job-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const jobId = button.getAttribute('data-job-id');
      openDeleteModal(jobId);
    });
  });
}

function setupPagination() {
  const paginationElement = document.getElementById('jobs-pagination');
  if (!paginationElement) return;

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (totalPages <= 1) {
    paginationElement.innerHTML = '';
    return;
  }

  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="prev" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="next" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  paginationElement.innerHTML = paginationHTML;

  // Add event listeners to pagination links
  document.querySelectorAll('#jobs-pagination .page-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.closest('.page-link').getAttribute('data-page');

      if (page === 'prev') {
        if (currentPage > 1) {
          currentPage--;
          displayJobs(currentPage);
          setupPagination();
        }
      } else if (page === 'next') {
        if (currentPage < totalPages) {
          currentPage++;
          displayJobs(currentPage);
          setupPagination();
        }
      } else {
        currentPage = parseInt(page);
        displayJobs(currentPage);
        setupPagination();
      }
    });
  });
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();

  if (searchTerm === '') {
    filteredJobs = [...currentJobs];
  } else {
    filteredJobs = currentJobs.filter((job) => {
      const companyName = companies.get(job.company_id)?.name || '';
      const jobTitle = jobTitles.get(job.job_title_id)?.name || '';
      const categoryName = jobCategories.get(job.category_id)?.name || '';

      return (
        (job.city && job.city.toLowerCase().includes(searchTerm)) ||
        (job.country && job.country.toLowerCase().includes(searchTerm)) ||
        (job.description &&
          job.description.toLowerCase().includes(searchTerm)) ||
        (job.work_type && job.work_type.toLowerCase().includes(searchTerm)) ||
        (job.experience_level &&
          job.experience_level.toLowerCase().includes(searchTerm)) ||
        companyName.toLowerCase().includes(searchTerm) ||
        jobTitle.toLowerCase().includes(searchTerm) ||
        categoryName.toLowerCase().includes(searchTerm)
      );
    });
  }

  currentPage = 1;
  displayJobs(currentPage);
  setupPagination();
}

async function handleJobSubmit(e) {
  e.preventDefault();

  const jobId = document.getElementById('job-id').value;

  // Get the expires_at value and convert it to mm/dd/yyyy format
  const expiresAtInput = document.getElementById('job-expires-at').value;
  let formattedExpiresAt = '';

  if (expiresAtInput) {
    // Convert from yyyy-mm-dd to mm/dd/yyyy
    const date = new Date(expiresAtInput);
    if (!isNaN(date.getTime())) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      formattedExpiresAt = `${month}/${day}/${year}`;
    } else {
      showError('Invalid expiry date format');
      return;
    }
  }

  const jobData = {
    company_id: document.getElementById('job-company').value,
    job_title_id: document.getElementById('job-title').value,
    category_id: document.getElementById('job-category').value,
    city: document.getElementById('job-city').value,
    country: document.getElementById('job-country').value,
    work_type: document.getElementById('job-work-type').value,
    experience_level: document.getElementById('job-experience-level').value,
    salary: document.getElementById('job-salary').value,
    description: document.getElementById('job-description').value,
    expires_at: formattedExpiresAt, // Use the formatted date
  };

  // Validation
  if (!jobData.company_id) {
    showError('Company is required');
    return;
  }

  if (!jobData.job_title_id) {
    showError('Job title is required');
    return;
  }

  if (!jobData.category_id) {
    showError('Job category is required');
    return;
  }

  if (!jobData.city || !jobData.country) {
    showError('Location (city and country) is required');
    return;
  }

  if (!jobData.description) {
    showError('Job description is required');
    return;
  }

  if (!jobData.expires_at) {
    showError('Expiry date is required');
    return;
  }

  if (jobData.salary) {
    const salaryValue = parseFloat(jobData.salary);
    if (isNaN(salaryValue)) {
      showError('Salary must be a valid number');
      return;
    }
    if (salaryValue < 0 || salaryValue > 2147483647) {
      showError('Salary is out of acceptable range');
      return;
    }
    jobData.salary = salaryValue;
  } else {
    jobData.salary = 1;
  }

  try {
    showLoading(true);
    let result;
    if (jobId) {
      // Update existing job
      result = await JobsApi.updateJob(jobId, jobData);
    } else {
      // Create new job
      result = await JobsApi.createJob(jobData);
    }

    if (result) {
      closeAllModals();
      await loadData();
      showSuccess(
        jobId ? 'Job updated successfully' : 'Job created successfully'
      );
    } else {
      throw new Error(jobId ? 'Failed to update job' : 'Failed to create job');
    }
  } catch (error) {
    console.error('Error saving job:', error);
    showError(error.message || 'An error occurred while saving the job');
  } finally {
    showLoading(false);
  }
}

async function confirmDeleteJob() {
  const jobId = document.getElementById('job-id-to-delete').value;
  if (!jobId) return;

  try {
    showLoading(true);

    const result = await JobsApi.deleteJob(jobId);

    if (result) {
      closeAllModals();
      await loadData();
      showSuccess('Job deleted successfully');
    } else {
      throw new Error('Failed to delete job');
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    showError(error.message || 'An error occurred while deleting the job');
  } finally {
    showLoading(false);
  }
}

// Modals

function openJobModal(job = null) {
  const modalTitle = document.getElementById('job-modal-title');
  const jobForm = document.getElementById('job-form');
  const jobModal = document.getElementById('job-modal');

  if (!modalTitle || !jobForm || !jobModal) {
    console.error('Modal elements not found in the DOM');
    return;
  }

  // Reset the form
  jobForm.reset();

  // Set default date for expires_at (30 days from now)
  const defaultExpiryDate = new Date();
  defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);
  const expiryDateStr = defaultExpiryDate.toISOString().split('T')[0];

  if (job) {
    // Edit existing job
    modalTitle.textContent = 'Edit Job';
    document.getElementById('job-id').value = job.id;
    document.getElementById('job-company').value = job.company_id || '';
    document.getElementById('job-title').value = job.job_title_id || '';
    document.getElementById('job-category').value = job.category_id || '';
    document.getElementById('job-city').value = job.city || '';
    document.getElementById('job-country').value = job.country || '';
    document.getElementById('job-work-type').value = job.work_type || 'REMOTE';
    document.getElementById('job-experience-level').value =
      job.experience_level || 'JUNIOR';
    document.getElementById('job-salary').value = job.salary || '';
    document.getElementById('job-description').value = job.description || '';

    // Format the expires_at date for the input
    const expiryDate = job.expires_at
      ? new Date(job.expires_at).toISOString().split('T')[0]
      : expiryDateStr;
    document.getElementById('job-expires-at').value = expiryDate;
  } else {
    // Add new job
    modalTitle.textContent = 'Add Job';
    document.getElementById('job-id').value = '';
    document.getElementById('job-work-type').value = 'REMOTE';
    document.getElementById('job-experience-level').value = 'JUNIOR';
    document.getElementById('job-expires-at').value = expiryDateStr;
  }

  try {
    // Try Bootstrap 5 Modal constructor first
    const bsModal = new bootstrap.Modal(jobModal);
    bsModal.show();
  } catch (error) {
    // Fallback to showing manually
    jobModal.classList.add('show');
    jobModal.style.display = 'block';
    document.body.classList.add('modal-open');

    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
    }
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

function openDeleteModal(jobId) {
  const job = currentJobs.find((j) => j.id.toString() === jobId.toString());
  if (!job) return;

  const deleteModal = document.getElementById('delete-job-modal');
  const modalBody = deleteModal.querySelector('.modal-body p');
  const jobTitle = jobTitles.get(job.job_title_id)?.name || 'Unknown Position';
  const companyName = companies.get(job.company_id)?.name || 'Unknown Company';

  if (modalBody) {
    modalBody.textContent = `Are you sure you want to delete the job "${jobTitle} at ${companyName}"? This action cannot be undone.`;
  }

  document.getElementById('job-id-to-delete').value = jobId;

  try {
    // Try Bootstrap 5 Modal constructor first
    const bsModal = new bootstrap.Modal(deleteModal);
    bsModal.show();
  } catch (error) {
    // Fallback to showing manually
    deleteModal.classList.add('show');
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');

    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
    }
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        // Fallback manual closing
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');

        // Remove backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  });
}

// Helper functions
function showLoading(isLoading) {
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.classList.toggle('d-none', !isLoading);
    loadingSpinner.classList.toggle('d-flex', isLoading);
  }
}

function showError(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertsContainer.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

function showSuccess(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertsContainer.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}
