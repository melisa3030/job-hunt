import { companies, reviews, jobs } from './mockData.js';
import { urlLocationHandler } from './router.js';

export function renderCompanies() {
  const companiesListElement = document.querySelector('.companies__list');
  if (!companiesListElement) {
    console.error('Element with class .companies__list not found in the DOM.');
    return;
  }
  companiesListElement.innerHTML = '';

  companies.forEach((company) => {
    const companyItem = document.createElement('div');
    companyItem.className = 'companies__item';
    companyItem.dataset.id = company.id;

    const companyTitle = document.createElement('h4');
    companyTitle.textContent = company.name;

    const companyLocation = document.createElement('p');
    companyLocation.textContent = `${company.city}, ${company.country}`;

    const companyDescription = document.createElement('p');
    companyDescription.textContent = company.description;

    const companyReviews = reviews.filter(
      (review) => review.company_id === company.id
    );
    const averageRating =
      companyReviews.reduce((acc, review) => acc + review.rating, 0) /
        companyReviews.length || 0;

    const companyRating = document.createElement('p');
    companyRating.innerHTML = `<span>⭐</span> ${averageRating.toFixed(1)}`;

    const companyJobs = jobs.filter(
      (job) => job.company_id === company.id
    ).length;
    const companyJobsElement = document.createElement('p');
    companyJobsElement.innerHTML = `<strong>Jobs:</strong> ${companyJobs}`;

    const companyReviewsCount = document.createElement('p');
    companyReviewsCount.innerHTML = `<strong>Reviews:</strong> ${companyReviews.length}`;

    companyItem.append(
      companyTitle,
      companyLocation,
      companyDescription,
      companyRating,
      companyJobsElement,
      companyReviewsCount
    );

    companyItem.addEventListener('click', () => {
      window.history.pushState({}, '', `/company/${company.id}/about`);
      urlLocationHandler();
    });

    companiesListElement.appendChild(companyItem);
  });
}
