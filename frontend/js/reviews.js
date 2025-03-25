import { reviews, jobTitles, companies } from './mockData.js';

export function renderReviews() {
  const reviewsListElement = document.querySelector('.reviews__list');
  if (!reviewsListElement) {
    console.error('Element with class .reviews__list not found in the DOM.');
    return;
  }
  reviewsListElement.innerHTML = '';

  reviews.length === 0 && reviewsListElement.insertAdjacentHTML('beforeend', '<p>No reviews found</p>');

  reviews.forEach((review) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'reviews__item';
    reviewItem.dataset.id = review.id;

    const jobTitle = jobTitles.find((title) => title.id === review.job_title_id).name;
    const company = companies.find((company) => company.id === review.company_id).name;

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
    reviewRecommend.innerHTML = `<span>👍</span> ${review.recommend === 'yes' ? 'Recommends' : 'Doesn\'t recommend'}`;

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
    reviewTechnologies.innerHTML = review.technologies.map((tech) => `<span class="reviews__technology">${tech}</span>`).join('');

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
}