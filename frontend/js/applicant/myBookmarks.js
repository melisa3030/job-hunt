/* global bootstrap */
import { JobCategoriesApi } from '../api/jobCategoriesApi.js';
import { AuthApi } from '../api/authApi.js';
import { BookmarksApi } from '../api/bookmarksApi.js';

export async function initMyBookmarks() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const bookmarksTableBody = document.getElementById('bookmarks-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const loadingIndicator = document.getElementById('loading-bookmarks');
  const searchInput = document.getElementById('bookmark-search');
  const categoryFilter = document.getElementById('category-filter');
  const workTypeFilter = document.getElementById('work-type-filter');
  const searchBtn = document.getElementById('search-btn');

  const removeBookmarkModal = new bootstrap.Modal(
    document.getElementById('remove-bookmark-modal')
  );

  let currentBookmarks = [];
  let filteredBookmarks = [];
  let categories = [];
  let jobTitles = [];
  let companies = [];

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
    categoryFilter?.addEventListener('change', handleSearch);
    workTypeFilter?.addEventListener('change', handleSearch);

    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    confirmRemoveBtn?.addEventListener('click', confirmRemoveBookmark);
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadCategories() {
    try {
      const response = await JobCategoriesApi.getAllJobCategories();
      if (response && response.success) {
        categories = response.data || [];
        populateCategoryFilter();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  function populateCategoryFilter() {
    if (!categoryFilter) return;

    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categoryFilter.appendChild(option);
    });
  }

  async function loadBookmarks() {
    try {
      showLoading(true);
      bookmarksTableBody.innerHTML = '';

      const user = await AuthApi.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const bookmarksResponse =
        await BookmarksApi.getBookmarkedJobsForCurrentUser();

      if (!bookmarksResponse?.success || !bookmarksResponse?.data) {
        currentBookmarks = [];
        filteredBookmarks = [];
        renderBookmarks();
        return;
      }

      const bookmarks = bookmarksResponse.data;
      if (bookmarks.length === 0) {
        currentBookmarks = [];
        filteredBookmarks = [];
        renderBookmarks();
        return;
      }

      // Import APIs we need
      const { JobsApi } = await import('../api/jobsApi.js');
      const { CompaniesApi } = await import('../api/companiesApi.js');
      const { JobTitlesApi } = await import('../api/jobTitlesApi.js');
      const { JobCategoriesApi } = await import('../api/jobCategoriesApi.js');

      // Load all jobs, companies, and job titles once to avoid multiple API calls
      const [
        jobsResponse,
        companiesResponse,
        jobTitlesResponse,
        categoriesResponse,
      ] = await Promise.all([
        JobsApi.getAllJobs(),
        CompaniesApi.getAllCompanies(),
        JobTitlesApi.getAllJobTitles(),
        JobCategoriesApi.getAllJobCategories(),
      ]);

      const jobs =
        jobsResponse?.success && jobsResponse?.data ? jobsResponse.data : [];
      companies =
        companiesResponse?.success && companiesResponse?.data
          ? companiesResponse.data
          : [];
      jobTitles =
        jobTitlesResponse?.success && jobTitlesResponse?.data
          ? jobTitlesResponse.data
          : [];
      categories =
        categoriesResponse?.success && categoriesResponse?.data
          ? categoriesResponse.data
          : [];

      // Create lookup maps for quick access
      const jobsMap = new Map(jobs.map((job) => [job.id, job]));
      const companiesMap = new Map(
        companies.map((company) => [company.id, company])
      );
      const jobTitlesMap = new Map(jobTitles.map((title) => [title.id, title]));
      const categoriesMap = new Map(
        categories.map((category) => [category.id, category])
      );

      // Enhance bookmarks with job, company and job title data
      const enhancedBookmarks = bookmarks.map((bookmark) => {
        const job = jobsMap.get(parseInt(bookmark.job_id));

        if (!job) {
          return {
            ...bookmark,
            job_title: 'Unknown Job',
            company_name: 'Unknown Company',
            category_name: 'Unknown Category',
            bookmarked_at: bookmark.created_at,
          };
        }

        const company = companiesMap.get(job.company_id);
        const jobTitle = jobTitlesMap.get(job.job_title_id);
        const category = categoriesMap.get(job.category_id);

        return {
          ...bookmark,
          ...job,
          company_name: company?.name || 'Unknown Company',
          job_title: jobTitle?.name || 'Unknown Title',
          category_name: category?.name || 'Unknown Category',
          bookmarked_at: bookmark.created_at,
        };
      });

      console.log('Enhanced bookmarks:', enhancedBookmarks); // Debug

      currentBookmarks = enhancedBookmarks;
      filteredBookmarks = [...enhancedBookmarks];
      renderBookmarks();
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      showError('Failed to load bookmarks. Please try again.');
      bookmarksTableBody.innerHTML =
        '<tr><td colspan="9" class="text-center text-danger">Failed to load bookmarks</td></tr>';
    } finally {
      showLoading(false);
    }
  }

  function renderBookmarks() {
    bookmarksTableBody.innerHTML = '';

    if (filteredBookmarks.length === 0) {
      bookmarksTableBody.innerHTML =
        '<tr><td colspan="9" class="text-center">No bookmarked jobs found</td></tr>';
      return;
    }

    filteredBookmarks.forEach((bookmark, index) => {
      const row = document.createElement('tr');

      // Handle possible invalid date
      let bookmarkedDate = 'N/A';
      try {
        if (bookmark.bookmarked_at || bookmark.created_at) {
          const dateStr = bookmark.bookmarked_at || bookmark.created_at;
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            bookmarkedDate = date.toLocaleDateString();
          }
        }
      } catch {
        console.warn(
          'Invalid date format:',
          bookmark.bookmarked_at || bookmark.created_at
        );
      }

      const salary = bookmark.salary
        ? `$${bookmark.salary.toLocaleString()}`
        : 'Not specified';

      const location =
        bookmark.city && bookmark.country
          ? `${bookmark.city}, ${bookmark.country}`
          : bookmark.city || bookmark.country || 'N/A';

      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${bookmark.job_title || 'N/A'}</td>
      <td>${bookmark.company_name || 'N/A'}</td>
      <td>${bookmark.category_name || 'N/A'}</td>
      <td>${location}</td>
      <td>
        <span class="badge ${getWorkTypeBadgeClass(bookmark.work_type)}">${bookmark.work_type || 'N/A'}</span>
      </td>
      <td>${salary}</td>
      <td>${bookmarkedDate}</td>
      <td>
        <div class="btn-group btn-group-sm">

          <button class="btn btn-outline-danger remove-bookmark-btn" data-job-id="${bookmark.job_id}" data-title="${bookmark.job_title || 'this job'}">
            <i class="fas fa-bookmark"></i> Remove
          </button>
        </div>
      </td>
    `;

      bookmarksTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.remove-bookmark-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        openRemoveBookmarkModal(btn.dataset.jobId, btn.dataset.title)
      );
    });
  }

  // ===========================
  // === Bookmark Actions
  // ===========================

  async function removeBookmark(jobId) {
    try {
      showLoading(true);

      const response = await BookmarksApi.deleteBookmark(jobId);

      if (response && response.success) {
        showSuccess('Job removed from bookmarks successfully');
        await loadBookmarks();
      } else {
        const errorMessage = response?.error || 'Failed to remove bookmark';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showError(`Failed to remove bookmark: ${error.message}`);
    } finally {
      showLoading(false);
    }
  }

  function openRemoveBookmarkModal(jobId, jobTitle) {
    const modalBody =
      removeBookmarkModal._element.querySelector('.modal-body p');

    if (modalBody) {
      modalBody.textContent = `Are you sure you want to remove "${jobTitle}" from your bookmarks?`;
    }

    document.getElementById('job-id-to-remove').value = jobId;
    removeBookmarkModal.show();
  }

  async function confirmRemoveBookmark() {
    const jobId = document.getElementById('job-id-to-remove').value;
    if (!jobId) return;

    removeBookmarkModal.hide();
    await removeBookmark(jobId);
  }

  // ===========================
  // === Search & Filtering
  // ===========================
  function handleSearch() {
    const searchTerm = searchInput?.value.toLowerCase().trim() || '';
    const categoryValue = categoryFilter?.value || '';
    const workTypeValue = workTypeFilter?.value || '';

    filteredBookmarks = currentBookmarks.filter((bookmark) => {
      if (!bookmark) return false;

      const matchesSearch =
        !searchTerm ||
        (bookmark.job_title &&
          bookmark.job_title.toLowerCase().includes(searchTerm)) ||
        (bookmark.company_name &&
          bookmark.company_name.toLowerCase().includes(searchTerm));

      const matchesCategory =
        !categoryValue || bookmark.category_id?.toString() === categoryValue;
      const matchesWorkType =
        !workTypeValue || bookmark.work_type === workTypeValue;

      return matchesSearch && matchesCategory && matchesWorkType;
    });

    renderBookmarks();
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

  function getWorkTypeBadgeClass(workType) {
    switch (workType) {
      case 'REMOTE':
        return 'bg-success';
      case 'HYBRID':
        return 'bg-warning';
      case 'ON_SITE':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }

  // ===========================
  // === Initialization
  // ===========================
  await loadCategories();
  await loadBookmarks();
  setupEventListeners();
}
