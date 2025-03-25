import { companies, reviews } from './mockData.js';

export const renderCompanyTab = async (id, tab) => {
  const company = companies.find((company) => company.id === parseInt(id));
  if (!company) {
    console.error('Company not found');
    return;
  }

  const companyNameElement = document.querySelector('.company__name');
  const companyRatingElement = document.querySelector('.company__rating');

  const companyReviews = reviews.filter(
    (review) => review.company_id === company.id
  );
  const averageRating =
    companyReviews.reduce((acc, review) => acc + review.rating, 0) /
      companyReviews.length || 0;

  companyNameElement.textContent = company.name;
  companyRatingElement.innerHTML = `${averageRating.toFixed(1)} ⭐`;

  const companyTabs = {
    about: await fetch(`/views/company/company-about.html`).then((response) =>
      response.text()
    ),
    reviews: await fetch(`/views/company/company-reviews.html`).then(
      (response) => response.text()
    ),
    jobs: await fetch(`/views/company/company-jobs.html`).then((response) =>
      response.text()
    ),
  };

  const content = companyTabs[tab] || companyTabs['about'];
  document.getElementById('company-tab-content').innerHTML = content;
};
