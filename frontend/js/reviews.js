// reviews.js
import { ReviewsApi } from './api/reviewsApi.js';
import { CompaniesApi } from './api/companiesApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { createReviewCard } from './components/reviewCard.js';

export async function renderReviews() {
  const mainContainer = document.querySelector('.reviews');
  const reviewsListElement = document.querySelector('.reviews__list');

  if (!reviewsListElement || !mainContainer) {
    console.error('Required elements not found in the DOM.');
    return;
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

    reviewsListElement.innerHTML = ''; // Clear the list

    // Create maps for quick lookups
    const jobTitlesMap = new Map(jobTitles.map(title => [title.id, title]));
    const companiesMap = new Map(companies.map(company => [company.id, company]));

    reviews.forEach((review) => {
      const jobTitle = jobTitlesMap.get(review.job_title_id)?.name || 'Unknown Position';
      const company = companiesMap.get(review.company_id)?.name || 'Unknown Company';

      const reviewCard = createReviewCard(review, jobTitle, company);
      reviewsListElement.appendChild(reviewCard);
    });
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