/* global bootstrap */
import { ReviewsApi } from '../api/reviewsApi.js';
import { CompaniesApi } from '../api/companiesApi.js';
import { JobTitlesApi } from '../api/jobTitlesApi.js';
import { AuthApi } from '../api/authApi.js';

export async function initMyReviews() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const reviewsTableBody = document.getElementById('reviews-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const loadingIndicator = document.getElementById('loading-reviews');
  const searchInput = document.getElementById('review-search');
  const ratingFilter = document.getElementById('rating-filter');
  const recommendFilter = document.getElementById('recommend-filter');
  const searchBtn = document.getElementById('search-btn');
  const addReviewBtn = document.getElementById('add-review-btn');

  const reviewModal = new bootstrap.Modal(
    document.getElementById('review-modal')
  );
  const reviewForm = document.getElementById('review-form');
  const reviewIdInput = document.getElementById('review-id');
  const companySelect = document.getElementById('company-select');
  const jobTitleSelect = document.getElementById('job-title-select');
  const reviewRating = document.getElementById('review-rating');
  const reviewRecommend = document.getElementById('review-recommend');
  const employmentType = document.getElementById('employment-type');
  const employmentDuration = document.getElementById('employment-duration');
  const currentlyWorking = document.getElementById('currently-working');
  const positiveReview = document.getElementById('positive-review');
  const negativeReview = document.getElementById('negative-review');
  const anonymousReview = document.getElementById('anonymous-review');
  const modalTitle = document.getElementById('review-modal-label');
  const deleteModal = new bootstrap.Modal(
    document.getElementById('delete-review-modal')
  );
  let currentReviews = [];
  let filteredReviews = [];
  let companies = [];
  let jobTitles = [];

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addReviewBtn?.addEventListener('click', handleAddReview);
    reviewForm?.addEventListener('submit', handleFormSubmit);
    searchBtn?.addEventListener('click', handleSearch);
    searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
    ratingFilter?.addEventListener('change', handleSearch);
    recommendFilter?.addEventListener('change', handleSearch);

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    confirmDeleteBtn?.addEventListener('click', confirmDeleteReview);
  }
  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadCompanies() {
    try {
      const response = await CompaniesApi.getAllCompanies();
      if (response && response.success) {
        companies = response.data || [];
        populateCompanySelect();
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  }

  async function loadJobTitles() {
    try {
      const response = await JobTitlesApi.getAllJobTitles();
      if (response && response.success) {
        jobTitles = response.data || [];
        populateJobTitleSelect();
      }
    } catch (error) {
      console.error('Error loading job titles:', error);
    }
  }

  function populateCompanySelect() {
    companySelect.innerHTML = '<option value="">Select a company...</option>';
    companies.forEach((company) => {
      const option = document.createElement('option');
      option.value = company.id;
      option.textContent = company.name;
      companySelect.appendChild(option);
    });
  }

  function populateJobTitleSelect() {
    jobTitleSelect.innerHTML =
      '<option value="">Select a job title...</option>';
    jobTitles.forEach((jobTitle) => {
      const option = document.createElement('option');
      option.value = jobTitle.id;
      option.textContent = jobTitle.name;
      jobTitleSelect.appendChild(option);
    });
  }
  async function loadReviews() {
    try {
      showLoading(true);
      reviewsTableBody.innerHTML = '';

      const user = await AuthApi.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const reviewsResponse = await ReviewsApi.getReviewsByCurrentUser();

      if (reviewsResponse && reviewsResponse.success) {
        // Backend now returns empty array instead of 404 error for "no data found"
        currentReviews = reviewsResponse.data || [];
        filteredReviews = [...currentReviews];
        renderReviews(filteredReviews);
      } else {
        // This should only happen for real errors like server errors or authentication issues
        throw new Error(reviewsResponse?.error || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      showError('Failed to load reviews. Please try again.');
      reviewsTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center text-danger">Failed to load reviews</td></tr>';
    } finally {
      showLoading(false);
    }
  }
  function renderReviews(reviews) {
    reviewsTableBody.innerHTML = '';

    if (reviews.length === 0) {
      reviewsTableBody.innerHTML =
        '<tr><td colspan="6" class="text-center">No reviews found</td></tr>';
      return;
    }

    reviews.forEach((review, index) => {
      const row = document.createElement('tr');
      const reviewDate = new Date(review.created_at).toLocaleDateString();
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

      const companyName = companies.find(
        (c) => c.id === review.company_id
      )?.name;

      const jobTitleName = jobTitles.find(
        (jt) => jt.id === review.job_title_id
      )?.name;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          ${companyName || 'N/A'}
          <br>
          <small class="text-muted">${jobTitleName || 'N/A'}</small>
        </td>
        <td>
          <span class="text-warning">${stars}</span>
          <small class="text-muted">(${review.rating}/5)</small>
        </td>
        <td>
          <span class="badge ${review.recommend === 'YES' ? 'bg-success' : 'bg-danger'}">
            ${review.recommend === 'YES' ? 'Yes' : 'No'}
          </span>
        </td>
        <td>${reviewDate}</td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary edit-btn" data-id="${review.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-outline-danger delete-btn" data-id="${review.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      `;

      reviewsTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleEditReview(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleDeleteReview(btn.dataset.id));
    });
  }

  // ===========================
  // === Search & Filtering
  // ===========================
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const ratingValue = ratingFilter.value;
    const recommendValue = recommendFilter.value;

    filteredReviews = currentReviews.filter((review) => {
      if (!review) return false;
      const matchesSearch =
        !searchTerm ||
        (review.company_name &&
          review.company_name.toLowerCase().includes(searchTerm)) ||
        (review.job_title_name &&
          review.job_title_name.toLowerCase().includes(searchTerm));

      const matchesRating =
        !ratingValue || review.rating.toString() === ratingValue;
      const matchesRecommend =
        !recommendValue || review.recommend === recommendValue;

      return matchesSearch && matchesRating && matchesRecommend;
    });

    renderReviews(filteredReviews);
  }

  // ===========================
  // === CRUD Operations
  // ===========================
  async function saveReview(reviewData, reviewId) {
    try {
      let response;

      if (reviewId) {
        response = await ReviewsApi.updateReview(reviewId, reviewData);
      } else {
        response = await ReviewsApi.createReview(reviewData);
      }

      if (response && response.success) {
        showSuccess(
          reviewId
            ? 'Review updated successfully'
            : 'Review created successfully'
        );
        reviewModal.hide();
        await loadReviews();
      } else {
        throw new Error(response?.error || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      showError(`Failed to save review: ${error.message}`);
    }
  }

  async function deleteReview(reviewId) {
    if (!reviewId) return;

    try {
      const response = await ReviewsApi.deleteReview(reviewId);

      if (response && response.success) {
        showSuccess('Review deleted successfully');
        deleteModal.hide();
        await loadReviews();
      } else {
        throw new Error(response?.error || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Failed to delete review. Please try again.');
    }
  }

  async function confirmDeleteReview() {
    const reviewId = document.getElementById('review-id-to-delete').value;
    await deleteReview(reviewId);
  }

  // ===========================
  // === Modal & Form Functions
  // ===========================
  function resetForm() {
    reviewForm.reset();
    reviewIdInput.value = '';
    modalTitle.textContent = 'Add Review';
    reviewForm.classList.remove('was-validated');
  }

  function handleAddReview() {
    resetForm();
    reviewModal.show();
  }

  function handleEditReview(reviewId) {
    const review = currentReviews.find(
      (r) => r.id.toString() === reviewId.toString()
    );
    if (!review) return;

    reviewIdInput.value = review.id;
    companySelect.value = review.company_id || '';
    jobTitleSelect.value = review.job_title_id || '';
    reviewRating.value = review.rating || '';
    reviewRecommend.value = review.recommend || '';
    employmentType.value = review.employment_type || '';
    employmentDuration.value = review.employment_duration || '';
    currentlyWorking.value = review.currently_working || '';
    positiveReview.value = review.positive_review || '';
    negativeReview.value = review.negative_review || '';

    // Fix: This line was just evaluating the expression but not assigning anything
    // anonymousReview.checked ? 1 : 0;

    // Correct way to set the checked state based on review.anonymous
    anonymousReview.checked = review.anonymous == 1; // Use loose equality to handle different types

    modalTitle.textContent = 'Edit Review';
    reviewForm.classList.remove('was-validated');

    reviewModal.show();
  }

  function handleDeleteReview(reviewId) {
    document.getElementById('review-id-to-delete').value = reviewId;
    deleteModal.show();
  }
  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!reviewForm.checkValidity()) {
      event.stopPropagation();
      reviewForm.classList.add('was-validated');
      return;
    }

    // Ensure all fields have valid values before submission
    const reviewData = {
      company_id: parseInt(companySelect.value) || 0,
      job_title_id: parseInt(jobTitleSelect.value) || 0,
      rating: parseInt(reviewRating.value) || 5,
      recommend: reviewRecommend.value || 'NO',
      employment_type: employmentType.value || '',
      employment_duration: employmentDuration.value || '',
      currently_working: currentlyWorking.value || 'NO',
      positive_review: positiveReview.value.trim() || '',
      negative_review: negativeReview.value.trim() || '',
      anonymous: anonymousReview.checked ? 1 : 0,
    };

    const reviewId = reviewIdInput.value;
    await saveReview(reviewData, reviewId);
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
  // === Initialization
  // ===========================
  await loadCompanies();
  await loadJobTitles();
  await loadReviews();
  setupEventListeners();
}
