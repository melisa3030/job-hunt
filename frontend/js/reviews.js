import { ReviewsApi } from './api/reviewsApi.js';
import { CompaniesApi } from './api/companiesApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';

export async function renderReviews() {
  const reviewsListElement = document.querySelector('.reviews__list');
  if (!reviewsListElement) {
    console.error('Element with class .reviews__list not found in the DOM.');
    return;
  }

  // Show loading state
  reviewsListElement.innerHTML = '<div class="reviews__loading">Loading reviews...</div>';

  try {
    // Fetch all necessary data in parallel
    const [reviews, companies, jobTitles] = await Promise.all([
      ReviewsApi.getAllReviews(),
      CompaniesApi.getAllCompanies(),
      JobTitlesApi.getAllJobTitles()
    ]);

    reviewsListElement.innerHTML = '';

    if (!reviews || reviews.length === 0) {
      reviewsListElement.innerHTML = '<p>No reviews found</p>';
      return;
    }

    reviews.forEach((review) => {
      const reviewItem = document.createElement('div');
      reviewItem.className = 'reviews__item';
      reviewItem.dataset.id = review.id;

      const jobTitleObj = jobTitles.find((title) => title.id === review.job_title_id);
      const companyObj = companies.find((company) => company.id === review.company_id);
      const jobTitle = jobTitleObj ? jobTitleObj.name : 'Unknown';
      const company = companyObj ? companyObj.name : 'Unknown';

      const reviewTitle = document.createElement('h4');
      reviewTitle.textContent = jobTitle;

      const reviewCompany = document.createElement('a');
      reviewCompany.className = 'reviews__company';
      reviewCompany.href = `company/${review.company_id}/about`;
      reviewCompany.textContent = company;

      const reviewDate = document.createElement('p');
      reviewDate.className = 'reviews__date';
      reviewDate.innerHTML = `<span>📅</span> ${new Date(review.created_at).toLocaleDateString('sr-RS')}`;

      const reviewRatingContainer = document.createElement('div');
      reviewRatingContainer.className = 'reviews__rating-container';

      const reviewRating = document.createElement('p');
      reviewRating.className = 'reviews__rating';
      reviewRating.innerHTML = `<span>⭐</span> ${review.rating}`;

      const reviewRecommend = document.createElement('p');
      reviewRecommend.className = 'reviews__recommend';
      reviewRecommend.innerHTML = `<span>👍</span> ${review.recommend === 'YES' ? 'Recommends' : 'Doesn\'t recommend'}`;

      reviewRatingContainer.appendChild(reviewRating);
      reviewRatingContainer.appendChild(reviewRecommend);

      const reviewPositive = document.createElement('p');
      reviewPositive.className = 'reviews__positive';
      reviewPositive.innerHTML = `<strong>Positive:</strong> ${review.positive_review}`;

      const reviewNegative = document.createElement('p');
      reviewNegative.className = 'reviews__negative';
      reviewNegative.innerHTML = `<strong>Negative:</strong> ${review.negative_review}`;

      const reviewTechnologies = document.createElement('div');
      reviewTechnologies.className = 'reviews__technologies';
      if (Array.isArray(review.technologies)) {
        reviewTechnologies.innerHTML = review.technologies.map((tech) => `<span class="reviews__technology">${tech}</span>`).join('');
      }

      reviewItem.append(
        reviewDate,
        reviewRatingContainer,
        reviewTitle,
        reviewCompany,
        reviewPositive,
        reviewNegative,
        reviewTechnologies
      );
      reviewsListElement.appendChild(reviewItem);
    });
  } catch (error) {
    reviewsListElement.innerHTML = `<div class="reviews__error">Failed to load reviews. Please try again later.</div>`;
    console.error(error);
  }
}

