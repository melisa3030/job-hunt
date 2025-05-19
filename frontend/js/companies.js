// companies.js
import { CompaniesApi } from './api/companiesApi.js';
import { JobsApi } from './api/jobsApi.js';
import { ReviewsApi } from './api/reviewsApi.js';
import { createCompanyCard } from './components/companyCard.js';

export async function renderCompanies() {
  const mainContainer = document.querySelector('.companies');
  const companiesListElement = document.querySelector('.companies__list');

  if (!companiesListElement || !mainContainer) {
    console.error('Required elements not found in the DOM.');
    return;
  }

  try {
    const spinnerElement = document.createElement('div');
    spinnerElement.className = 'd-flex justify-content-center align-items-center my-3';
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
      companiesListElement.innerHTML = '<div class="companies__empty">No companies found.</div>';
      return;
    }

    companiesListElement.innerHTML = ''; // Clear the list

    companies.forEach((company) => {
      // Calculate job count
      const companyJobs = jobs.filter(
        (job) => job.company_id === company.id
      ).length;

      // Calculate reviews data
      const companyReviews = reviews.filter(
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
  } catch (error) {
    console.error('Failed to fetch data:', error);
    // Remove spinner if it exists
    const existingSpinner = mainContainer.querySelector('.spinner-border').closest('div');
    if (existingSpinner) {
      existingSpinner.remove();
    }
    companiesListElement.style.display = '';
    companiesListElement.innerHTML = '<div class="companies__error">Failed to load companies. Please try again later.</div>';
  }
}