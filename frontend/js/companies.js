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

// ===========================
// === Display Functions
// ===========================

// Sort and display companies based on current criteria and direction
function sortAndDisplayCompanies() {
  const companiesListElement = document.querySelector('.companies__list');
  companiesListElement.innerHTML = '';

  if (!allCompanies || allCompanies.length === 0) {
    companiesListElement.innerHTML =
      '<div class="companies__empty">No companies match your search criteria.</div>';
    return;
  }

  // Create a new array to avoid modifying the original
  const sortedCompanies = [...allCompanies];

  // Sort companies based on the selected criteria and direction
  sortedCompanies.sort((a, b) => {
    // Sort by number of reviews as default
    const aReviewsCount = allReviews.filter(
      (review) => review && review.company_id === a.id
    ).length;
    const bReviewsCount = allReviews.filter(
      (review) => review && review.company_id === b.id
    ).length;

    return bReviewsCount - aReviewsCount; // Descending order
  });

  // Display the sorted companies
  sortedCompanies
    .filter((company) => company && company.id) // Filter out invalid companies
    .forEach((company) => {
      // Calculate job count with validation
      const companyJobs = allJobs.filter(
        (job) => job && job.company_id === company.id
      ).length;

      // Calculate reviews data with validation
      const companyReviews = allReviews.filter(
        (review) => review && review.company_id === company.id && review.rating
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

    // Process companies with additional data
    const processedCompanies = processCompaniesData();

    // Render companies
    displayCompanies(processedCompanies);
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

      return {
        ...company,
        jobCount,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: companyReviews.length,
      };
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
    const companyCard = createCompanyCard(company);
    companiesContainer.appendChild(companyCard);
  });
}
