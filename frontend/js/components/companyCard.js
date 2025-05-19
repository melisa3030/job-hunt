import { urlLocationHandler } from '../router.js';

export const createCompanyCard = (company, jobsCount = 0, reviewsData = { count: 0, averageRating: 0 }) => {
  const companyItem = document.createElement('div');
  companyItem.className = 'companies__item';
  companyItem.dataset.id = company.id;
  companyItem.addEventListener('click', (e) => {
    if (!e.target.closest('.companies__actions')) {
      window.history.pushState({}, '', `/company/${company.id}/about`);
      urlLocationHandler();
    }
  })

  companyItem.innerHTML = `
    <h2 class="companies__title">${company.name}</h2>
    
    <p class="companies__location">
      <span class="companies__location-icon">📍</span> ${company.city}, ${company.country}
    </p>
    
    <p class="companies__description">${company.description || 'No description available'}</p>
    
    <div class="companies__stats">
      <p class="companies__rating">
        <span class="companies__rating-icon">⭐</span> ${reviewsData.averageRating.toFixed(1)}
      </p>
      
      <p class="companies__jobs-count">
        <span class="companies__jobs-icon">💼</span> ${jobsCount} ${jobsCount === 1 ? 'Job' : 'Jobs'}
      </p>
      
      <p class="companies__reviews-count">
        <span class="companies__reviews-icon">📝</span> ${reviewsData.count} ${reviewsData.count === 1 ? 'Review' : 'Reviews'}
      </p>
    </div>
    
    ${
      company.technologies && company.technologies.length > 0
        ? `
      <div class="companies__technologies">
        ${company.technologies.map((tech) => `<span class="companies__technology">${tech}</span>`).join('')}
      </div>
    `
        : ''
    }
    
    <div class="companies__actions">
      <a href="/company/${company.id}/about" class="companies__about-btn">About</a>
      <a href="/company/${company.id}/jobs" class="companies__jobs-btn">View Jobs</a>
      <a href="/company/${company.id}/reviews" class="companies__reviews-btn">Reviews</a>
    </div>
  `;

  // Add click event to the whole card (excluding action buttons)
  companyItem.addEventListener('click', (e) => {
    // Don't trigger if clicking on action buttons
    if (!e.target.closest('.companies__actions')) {
      window.history.pushState({}, '', `/company/${company.id}/about`);
      urlLocationHandler();
    }
  });

  return companyItem;
};