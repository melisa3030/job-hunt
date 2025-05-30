import { ReviewsApi } from './api/reviewsApi.js';
import { CompaniesApi } from './api/companiesApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { createReviewCard } from './components/reviewCard.js';
import { debounceFilterInput } from './utils/debounceFilterInput.js';

let allReviews = [];
let jobTitlesMap = new Map();
let companiesMap = new Map();
let filteredReviews = [];

// Initialize the filtering functionality
function initReviewsFilter() {
  // Get all filter inputs
  const keywordInput = document.getElementById('keywordInput');
  const jobPositionInput = document.querySelector(
    '.reviews__filter-input[placeholder="Job position"]'
  );
  const companyInput = document.querySelector(
    '.reviews__filter-input[placeholder="Company"]'
  );
  const reviewTypeSelect = document.querySelector('.reviews__filter-select');

  // Set up event listeners for filter inputs with debounce
  if (keywordInput) {
    keywordInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
  }
  if (jobPositionInput) {
    jobPositionInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
  }
  if (companyInput) {
    companyInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
  }
  if (reviewTypeSelect) {
    reviewTypeSelect.addEventListener('change', applyFilters);
  }
}

// Function to display reviews based on filtered data
function displayReviews(reviewsToDisplay) {
  const reviewsListElement = document.querySelector('.reviews__list');
  reviewsListElement.innerHTML = '';

  if (!reviewsToDisplay || reviewsToDisplay.length === 0) {
    reviewsListElement.innerHTML =
      '<div class="reviews__empty">No reviews match your search criteria.</div>';
    return;
  }

  reviewsToDisplay.forEach((review) => {
    const jobTitle =
      jobTitlesMap.get(review.job_title_id)?.name || 'Unknown Position';
    const company =
      companiesMap.get(review.company_id)?.name || 'Unknown Company';

    const reviewCard = createReviewCard(review, jobTitle, company);
    reviewsListElement.appendChild(reviewCard);
  });
}

// Apply filters and update the displayed reviews
function applyFilters() {
  // Get filter values
  const keyword =
    document.getElementById('keywordInput')?.value.toLowerCase() || '';
  const jobPosition =
    document
      .querySelector('.reviews__filter-input[placeholder="Job position"]')
      ?.value.toLowerCase() || '';
  const company =
    document
      .querySelector('.reviews__filter-input[placeholder="Company"]')
      ?.value.toLowerCase() || '';
  const reviewType =
    document.querySelector('.reviews__filter-select')?.value || '';

  // Filter the reviews based on all criteria
  filteredReviews = allReviews.filter((review) => {
    // Get job title and company names for filtering
    const jobTitle = jobTitlesMap.get(review.job_title_id)?.name || '';
    const companyName = companiesMap.get(review.company_id)?.name || '';

    // Keyword filter (checks all text fields)
    const keywordMatch =
      keyword === '' ||
      jobTitle.toLowerCase().includes(keyword) ||
      companyName.toLowerCase().includes(keyword) ||
      (review.positive_review &&
        review.positive_review.toLowerCase().includes(keyword)) ||
      (review.negative_review &&
        review.negative_review.toLowerCase().includes(keyword));

    // Job position filter
    const jobPositionMatch =
      jobPosition === '' || jobTitle.toLowerCase().includes(jobPosition);

    // Company filter
    const companyMatch =
      company === '' || companyName.toLowerCase().includes(company);

    // Review type filter (positive/negative based on rating)
    const reviewTypeMatch =
      reviewType === '' ||
      (reviewType === 'positive' && review.recommend === 'YES') ||
      (reviewType === 'negative' && review.recommend === 'NO');

    // Return true only if all filters match
    return keywordMatch && jobPositionMatch && companyMatch && reviewTypeMatch;
  });

  // Update the displayed reviews
  displayReviews(filteredReviews);
}

// Enhanced version of renderReviews that adds filtering capability
export async function renderReviews() {
  const mainContainer = document.querySelector('.reviews');
  const reviewsListElement = document.querySelector('.reviews__list');

  if (!reviewsListElement || !mainContainer) {
    console.error('Reviews list element or main container not found.');
    return;
  }

  try {
    // Show loading state
    const spinnerElement = document.createElement('div');
    spinnerElement.className =
      'd-flex justify-content-center align-items-center my-3';
    spinnerElement.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading reviews...</span>
      </div>
    `;
    mainContainer.insertBefore(spinnerElement, reviewsListElement);

    // Fetch all necessary data in parallel
    const [reviewsResponse, companiesResponse, jobTitlesResponse] =
      await Promise.all([
        ReviewsApi.getAllReviews(),
        CompaniesApi.getAllCompanies(),
        JobTitlesApi.getAllJobTitles(),
      ]);

    // Remove spinner and show list
    spinnerElement.remove();
    reviewsListElement.style.display = '';

    // Validate API responses and extract data
    const reviews = extractValidatedData(reviewsResponse, 'reviews');
    const companies = extractValidatedData(companiesResponse, 'companies');
    const jobTitles = extractValidatedData(jobTitlesResponse, 'job titles');

    if (!reviews || reviews.length === 0) {
      reviewsListElement.innerHTML =
        '<div class="reviews__empty">No reviews found.</div>';
      return;
    }

    // Store data for filtering later
    allReviews = reviews;
    filteredReviews = [...allReviews];

    // Create maps for quick lookups with validation
    jobTitlesMap = new Map(
      jobTitles
        .filter((title) => title && title.id && title.name)
        .map((title) => [title.id, title])
    );
    companiesMap = new Map(
      companies
        .filter((company) => company && company.id && company.name)
        .map((company) => [company.id, company])
    );

    // Display reviews (all reviews initially)
    displayReviews(filteredReviews);

    // Initialize filter functionality
    initReviewsFilter();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Remove spinner if it exists
    const existingSpinner = mainContainer
      .querySelector('.spinner-border')
      ?.closest('div');
    if (existingSpinner) {
      existingSpinner.remove();
    }
    reviewsListElement.style.display = '';
    reviewsListElement.innerHTML =
      '<div class="reviews__error">Failed to load reviews. Please try again later.</div>';
  }
}

// Helper function to extract and validate API response data
function extractValidatedData(response, dataType) {
  if (!response || !response.success) {
    console.warn(`Failed to load ${dataType}:`, response?.error);
    return [];
  }

  if (!response.data) {
    console.warn(`No data found for ${dataType}`);
    return [];
  }

  // Handle different response structures
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else {
    console.warn(`Unexpected data structure for ${dataType}:`, response.data);
    return [];
  }
}
