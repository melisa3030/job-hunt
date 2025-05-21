// companies.js
import { CompaniesApi } from './api/companiesApi.js';
import { JobsApi } from './api/jobsApi.js';
import { ReviewsApi } from './api/reviewsApi.js';
import { createCompanyCard } from './components/companyCard.js';

let allCompanies = [];
let allJobs = [];
let allReviews = [];
let filteredCompanies = [];
let sortingCriteria = 'reviews'; // Default sorting by number of reviews
let sortingDirection = 'desc'; // Default sort direction (descending)

export async function renderCompanies() {
  const mainContainer = document.querySelector('.companies');
  const companiesListElement = document.querySelector('.companies__list');
  const searchInput = document.querySelector('.companies__search-input');
  const searchButton = document.querySelector('.companies__search-btn');
  const sortSelect = document.querySelector('.companies__sort-select');

  // Create sort order toggle button if it doesn't exist
  let sortOrderToggle = document.getElementById('sort-order-toggle');
  const sortContainer = document.querySelector('.companies__sort');
  sortOrderToggle = document.createElement('button');
  sortOrderToggle.id = 'sort-order-toggle';
  sortOrderToggle.className = 'btn btn-outline-secondary ms-2';
  sortOrderToggle.innerHTML = 'Desc';
  sortContainer?.appendChild(sortOrderToggle);

  if (!companiesListElement || !mainContainer) {
    console.error('Required elements not found in the DOM.');
    return;
  }

  try {
    const spinnerElement = document.createElement('div');
    spinnerElement.className =
      'd-flex justify-content-center align-items-center my-3';
    spinnerElement.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    mainContainer.insertBefore(spinnerElement, companiesListElement);

    // Fetch all necessary data in parallel
    const [companies, jobs, reviews] = await Promise.all([
      CompaniesApi.getAllCompanies(),
      JobsApi.getAllJobs(),
      ReviewsApi.getAllReviews(),
    ]);

    // Remove spinner and show list
    spinnerElement.remove();
    companiesListElement.style.display = '';

    if (!companies || companies.length === 0) {
      companiesListElement.innerHTML =
        '<div class="companies__empty">No companies found.</div>';
      return;
    }

    // Store data for filtering and sorting
    allCompanies = companies;
    allJobs = jobs;
    allReviews = reviews;
    filteredCompanies = [...allCompanies];

    // Setup event listeners for search
    // Real-time search as user types
    if (searchInput) {
      searchInput.addEventListener(
        'input',
        debounce(filterCompaniesByName, 300)
      );
    }

    // Set up search button event (for users who prefer clicking the button)
    if (searchButton) {
      searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        filterCompaniesByName();
      });
    }

    // Set up sort select event
    if (sortSelect) {
      // Initial sort criteria value
      sortingCriteria = sortSelect.value;

      // Event listener for changes to sorting
      sortSelect.addEventListener('change', () => {
        sortingCriteria = sortSelect.value;
        sortAndDisplayCompanies();
      });
    }

    // Set up sort order toggle event
    if (sortOrderToggle) {
      // Set initial button text based on sort direction
      updateSortToggleText(sortOrderToggle);

      // Add event listener to toggle sort order
      sortOrderToggle.addEventListener('click', () => {
        sortingDirection = sortingDirection === 'desc' ? 'asc' : 'desc';
        updateSortToggleText(sortOrderToggle);
        sortAndDisplayCompanies();
      });
    }
    sortAndDisplayCompanies();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Remove spinner if it exists
    const existingSpinner = mainContainer
      .querySelector('.spinner-border')
      ?.closest('div');
    if (existingSpinner) {
      existingSpinner.remove();
    }
    companiesListElement.style.display = '';
    companiesListElement.innerHTML =
      '<div class="companies__error">Failed to load companies. Please try again later.</div>';
  }
}

// Update sort toggle button text/icon
function updateSortToggleText(button) {
  if (!button) return;
  button.textContent = sortingDirection === 'desc' ? 'Desc' : 'Asc';
}

// Filter companies by name
function filterCompaniesByName() {
  const searchInput = document.querySelector('.companies__search-input');
  const searchValue = searchInput?.value.toLowerCase().trim() || '';

  if (searchValue === '') {
    // If search is empty, show all companies
    filteredCompanies = [...allCompanies];
  } else {
    // Filter companies by name
    filteredCompanies = allCompanies.filter((company) =>
      company.name.toLowerCase().includes(searchValue)
    );
  }

  sortAndDisplayCompanies();
}

// Sort and display companies based on current criteria and direction
function sortAndDisplayCompanies() {
  const companiesListElement = document.querySelector('.companies__list');
  companiesListElement.innerHTML = '';

  if (!filteredCompanies || filteredCompanies.length === 0) {
    companiesListElement.innerHTML =
      '<div class="companies__empty">No companies match your search criteria.</div>';
    return;
  }

  // Create a new array to avoid modifying the original
  const sortedCompanies = [...filteredCompanies];

  // Sort companies based on the selected criteria and direction
  if (sortingCriteria === 'reviews') {
    // Sort by number of reviews
    sortedCompanies.sort((a, b) => {
      const aReviewsCount = allReviews.filter(
        (review) => review.company_id === a.id
      ).length;
      const bReviewsCount = allReviews.filter(
        (review) => review.company_id === b.id
      ).length;

      return sortingDirection === 'desc'
        ? bReviewsCount - aReviewsCount // Descending
        : aReviewsCount - bReviewsCount; // Ascending
    });
  } else if (sortingCriteria === 'jobs') {
    // Sort by number of jobs
    sortedCompanies.sort((a, b) => {
      const aJobsCount = allJobs.filter(
        (job) => job.company_id === a.id
      ).length;
      const bJobsCount = allJobs.filter(
        (job) => job.company_id === b.id
      ).length;

      return sortingDirection === 'desc'
        ? bJobsCount - aJobsCount // Descending
        : aJobsCount - bJobsCount; // Ascending
    });
  }

  // Display the sorted companies
  sortedCompanies.forEach((company) => {
    // Calculate job count
    const companyJobs = allJobs.filter(
      (job) => job.company_id === company.id
    ).length;

    // Calculate reviews data
    const companyReviews = allReviews.filter(
      (review) => review.company_id === company.id
    );
    const reviewsData = {
      count: companyReviews.length,
      averageRating:
        companyReviews.length > 0
          ? companyReviews.reduce((acc, review) => acc + review.rating, 0) /
            companyReviews.length
          : 0,
    };

    const companyCard = createCompanyCard(company, companyJobs, reviewsData);
    companiesListElement.appendChild(companyCard);
  });
}

// Utility function to debounce filter inputs (prevents too many updates while typing)
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
