import { ReviewsApi } from './api/reviewsApi.js';
import { CompaniesApi } from './api/companiesApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { createReviewCard } from './components/reviewCard.js';

// Store all reviews and related data for filtering
let allReviews = [];
let jobTitlesMap = new Map();
let companiesMap = new Map();
let filteredReviews = [];

// Initialize the filtering functionality
function initReviewsFilter() {
  // Get all filter inputs
  const keywordInput = document.getElementById('keywordInput');
  const jobPositionInput = document.querySelector('.reviews__filter-input[placeholder="Job position"]');
  const companyInput = document.querySelector('.reviews__filter-input[placeholder="Company"]');
  const reviewTypeSelect = document.querySelector('.reviews__filter-select');

  // Set up event listeners for filter inputs with debounce
  if (keywordInput) {
    keywordInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (jobPositionInput) {
    jobPositionInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (companyInput) {
    companyInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (reviewTypeSelect) {
    reviewTypeSelect.addEventListener('change', applyFilters);
  }

  // Remove search button event and trigger filtering directly on input changes
  const searchButton = document.querySelector('.reviews__filters__submit-btn');
  if (searchButton) {
    searchButton.style.display = 'none'; // Hide the search button
  }
}

// Enhanced version of renderReviews that adds filtering capability
export async function renderReviews() {
  const mainContainer = document.querySelector('.reviews');
  const reviewsListElement = document.querySelector('.reviews__list');
  const filtersContainer = document.querySelector('.reviews__filters');

  if (!reviewsListElement || !mainContainer) {
    console.error('Required elements not found in the DOM.');
    return;
  }

  // Add keyword input field before the job position input
  if (filtersContainer) {
    const filterGroup = filtersContainer.querySelector('.reviews__filter-group');
    if (filterGroup) {
      const keywordWrapper = document.createElement('div');
      keywordWrapper.className = 'reviews__filter-input-wrapper';
      keywordWrapper.innerHTML = `
        <input
          type="text"
          class="reviews__filter-input form-control"
          placeholder="Keyword"
          aria-label="Keyword"
          id="keywordInput"
        />
      `;

      const firstInputWrapper = filterGroup.querySelector('.reviews__filter-input-wrapper');
      if (firstInputWrapper) {
        filterGroup.insertBefore(keywordWrapper, firstInputWrapper);
      } else {
        filterGroup.appendChild(keywordWrapper);
      }
    }
  }

  try {
    // Show loading state
    const spinnerElement = document.createElement('div');
    spinnerElement.className = 'd-flex justify-content-center align-items-center my-3';
    spinnerElement.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading reviews...</span>
      </div>
    `;
    mainContainer.insertBefore(spinnerElement, reviewsListElement);

    // Fetch all necessary data in parallel
    const [reviews, companies, jobTitles] = await Promise.all([
      ReviewsApi.getAllReviews(),
      CompaniesApi.getAllCompanies(),
      JobTitlesApi.getAllJobTitles(),
    ]);

    // Remove spinner and show list
    spinnerElement.remove();
    reviewsListElement.style.display = '';

    if (!reviews || reviews.length === 0) {
      reviewsListElement.innerHTML = '<div class="reviews__empty">No reviews found.</div>';
      return;
    }

    // Store data for filtering later
    allReviews = reviews;
    filteredReviews = [...allReviews];

    // Create maps for quick lookups
    jobTitlesMap = new Map(jobTitles.map(title => [title.id, title]));
    companiesMap = new Map(companies.map(company => [company.id, company]));

    // Display reviews (all reviews initially)
    displayReviews(filteredReviews);

    // Initialize filter functionality
    initReviewsFilter();

  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Remove spinner if it exists
    const existingSpinner = mainContainer.querySelector('.spinner-border')?.closest('div');
    if (existingSpinner) {
      existingSpinner.remove();
    }
    reviewsListElement.style.display = '';
    reviewsListElement.innerHTML = '<div class="reviews__error">Failed to load reviews. Please try again later.</div>';
  }
}

// Function to display reviews based on filtered data
function displayReviews(reviewsToDisplay) {
  const reviewsListElement = document.querySelector('.reviews__list');
  reviewsListElement.innerHTML = '';

  if (!reviewsToDisplay || reviewsToDisplay.length === 0) {
    reviewsListElement.innerHTML = '<div class="reviews__empty">No reviews match your search criteria.</div>';
    return;
  }

  reviewsToDisplay.forEach((review) => {
    const jobTitle = jobTitlesMap.get(review.job_title_id)?.name || 'Unknown Position';
    const company = companiesMap.get(review.company_id)?.name || 'Unknown Company';

    const reviewCard = createReviewCard(review, jobTitle, company);
    reviewsListElement.appendChild(reviewCard);
  });
}

// Apply filters and update the displayed reviews
function applyFilters() {
  // Get filter values
  const keyword = document.getElementById('keywordInput')?.value.toLowerCase() || '';
  const jobPosition = document.querySelector('.reviews__filter-input[placeholder="Job position"]')?.value.toLowerCase() || '';
  const company = document.querySelector('.reviews__filter-input[placeholder="Company"]')?.value.toLowerCase() || '';
  const reviewType = document.querySelector('.reviews__filter-select')?.value || '';

  // Filter the reviews based on all criteria
  filteredReviews = allReviews.filter(review => {
    // Get job title and company names for filtering
    const jobTitle = jobTitlesMap.get(review.job_title_id)?.name || '';
    const companyName = companiesMap.get(review.company_id)?.name || '';

    // Keyword filter (checks all text fields)
    const keywordMatch = keyword === '' ||
      jobTitle.toLowerCase().includes(keyword) ||
      companyName.toLowerCase().includes(keyword) ||
      (review.positive_review && review.positive_review.toLowerCase().includes(keyword)) ||
      (review.negative_review && review.negative_review.toLowerCase().includes(keyword));

    // Job position filter
    const jobPositionMatch = jobPosition === '' ||
      jobTitle.toLowerCase().includes(jobPosition);

    // Company filter
    const companyMatch = company === '' ||
      companyName.toLowerCase().includes(company);

    // Review type filter (positive/negative based on rating)
    const reviewTypeMatch = reviewType === '' ||
      (reviewType === 'positive' && review.recommend === 'YES') ||
      (reviewType === 'negative' && review.recommend === 'NO');


    // Return true only if all filters match
    return keywordMatch && jobPositionMatch && companyMatch && reviewTypeMatch;
  });

  // Update the displayed reviews
  displayReviews(filteredReviews);
}

// Utility function to debounce filter inputs (prevents too many updates while typing)
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}