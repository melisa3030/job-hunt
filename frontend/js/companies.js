import { CompaniesApi } from './api/companiesApi.js';
import { JobsApi } from './api/jobsApi.js';
import { ReviewsApi } from './api/reviewsApi.js';
import { createCompanyCard } from './components/companyCard.js';
import { extractValidatedData } from './utils/apiResponseUtils.js';

// ===========================
// === State Variables
// ===========================
let allCompanies = [];
let allJobs = [];
let allReviews = [];
let currentSortBy = 'reviews';
let currentSortDirection = 'desc';

// ===========================
// === Sorting and Filtering
// ===========================

function initializeEventListeners() {
  // Sort criteria change
  const sortSelect = document.getElementById('sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      sortAndDisplayCompanies();
    });
  }

  // Sort direction buttons
  const sortAscBtn = document.getElementById('sort-asc');
  const sortDescBtn = document.getElementById('sort-desc');
  
  if (sortAscBtn && sortDescBtn) {
    sortAscBtn.addEventListener('click', () => {
      currentSortDirection = 'asc';
      updateSortButtons();
      sortAndDisplayCompanies();
    });

    sortDescBtn.addEventListener('click', () => {
      currentSortDirection = 'desc';
      updateSortButtons();
      sortAndDisplayCompanies();
    });
  }

  // Search functionality
  const searchInput = document.querySelector('.companies__search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterAndDisplayCompanies(e.target.value);
    });
  }
}

function updateSortButtons() {
  const ascBtn = document.getElementById('sort-asc');
  const descBtn = document.getElementById('sort-desc');
  
  if (ascBtn && descBtn) {
    ascBtn.classList.toggle('active', currentSortDirection === 'asc');
    descBtn.classList.toggle('active', currentSortDirection === 'desc');
  }
}

function sortAndDisplayCompanies(searchTerm = '') {
  const processedCompanies = processCompaniesData();
  
  // Filter by search term if provided
  let filteredCompanies = processedCompanies;
  if (searchTerm.trim()) {
    filteredCompanies = processedCompanies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let aValue, bValue;

    switch (currentSortBy) {
      case 'reviews':
        aValue = a.reviewCount;
        bValue = b.reviewCount;
        break;
      case 'jobs':
        aValue = a.jobCount;
        bValue = b.jobCount;
        break;
      case 'rating':
        aValue = a.averageRating;
        bValue = b.averageRating;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        aValue = a.reviewCount;
        bValue = b.reviewCount;
    }

    if (currentSortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  displayCompanies(sortedCompanies);
}

function filterAndDisplayCompanies(searchTerm) {
  sortAndDisplayCompanies(searchTerm);
}

// ===========================
// === Data Loading
// ===========================

export async function renderCompanies() {
  const companiesContainer = document.querySelector('.companies__list');

  if (!companiesContainer) {
    console.error('Companies container not found');
    return;
  }

  try {
    // Show loading state
    companiesContainer.innerHTML = `
      <div class="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading companies...</span>
        </div>
      </div>
    `;

    // Fetch all necessary data in parallel
    const [companiesResponse, jobsResponse, reviewsResponse] =
      await Promise.all([
        CompaniesApi.getAllCompanies(),
        JobsApi.getAllJobs(),
        ReviewsApi.getAllReviews(),
      ]);

    // Validate all API responses and extract data
    allCompanies = extractValidatedData(companiesResponse, 'companies');
    allJobs = extractValidatedData(jobsResponse, 'jobs');
    allReviews = extractValidatedData(reviewsResponse, 'reviews');

    console.log('Loaded data:', {
      companies: allCompanies?.length,
      jobs: allJobs?.length,
      reviews: allReviews?.length
    });

    // Initialize event listeners
    initializeEventListeners();

    // Initial sort and display
    sortAndDisplayCompanies();
  } catch (error) {
    console.error('Error loading companies:', error);
    companiesContainer.innerHTML = `
      <div class="alert alert-danger">
        Failed to load companies. Please try again later.
      </div>
    `;
  }
}

function processCompaniesData() {
  console.log('Processing companies data...');
  console.log('All companies:', allCompanies);
  console.log('All jobs:', allJobs);
  console.log('All reviews:', allReviews);

  return allCompanies
    .filter((company) => company && company.id && company.name)
    .map((company) => {
      // Calculate job count for this company
      const jobCount = allJobs.filter(
        (job) => job && job.company_id === company.id
      ).length;

      // Calculate average rating for this company
      const companyReviews = allReviews.filter(
        (review) => review && review.company_id === company.id && review.rating
      );

      const averageRating =
        companyReviews.length > 0
          ? companyReviews.reduce((acc, review) => acc + review.rating, 0) /
            companyReviews.length
          : 0;

      const processedCompany = {
        ...company,
        jobCount,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: companyReviews.length,
      };

      console.log(`Company ${company.name}:`, {
        id: company.id,
        jobCount,
        reviewCount: companyReviews.length,
        averageRating: processedCompany.averageRating
      });

      return processedCompany;
    });
}

function displayCompanies(companies) {
  const companiesContainer = document.querySelector('.companies__list');

  companiesContainer.innerHTML = '';

  if (!companies || companies.length === 0) {
    companiesContainer.innerHTML = `
      <div class="companies__empty">No companies found.</div>
    `;
    return;
  }

  companies.forEach((company) => {
    // Create reviews data object in the format expected by createCompanyCard
    const reviewsData = {
      count: company.reviewCount,
      averageRating: company.averageRating
    };

    // Call createCompanyCard with the correct parameters
    const companyCard = createCompanyCard(company, company.jobCount, reviewsData);
    companiesContainer.appendChild(companyCard);
  });
}
