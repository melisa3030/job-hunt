// components/jobCard.js
export const createJobCard = (job, jobTitle) => {
  const jobItem = document.createElement('div');
  jobItem.className = 'jobs__item';
  jobItem.dataset.id = job.id;

  jobItem.innerHTML = `
    <h2 class="jobs__title">${jobTitle?.name || 'Untitled Position'}</h2>
    
    <p class="jobs__company">${job.company?.name || 'Company Name Not Available'}</p>
    
    <p class="jobs__category">${job.category?.name || 'Uncategorized'}</p>
    
    ${job.perks && job.perks.length > 0 ? `
      <p class="jobs__perks">
        ${job.perks.map(perk => `<span class="jobs__perk">${perk.name}</span>`).join(' · ')}
      </p>
    ` : ''}
    
    <p class="jobs__location">
      <span class="jobs__location-icon">📍</span> ${job.city}, ${job.country} | ${job.work_type}
    </p>
    
    <p class="jobs__experience">Experience Level: ${job.experience_level}</p>
    
    <p class="jobs__salary">Salary: $${Number(job.salary).toLocaleString()}</p>
    
    <p class="jobs__description">${job.description}</p>
    
    <p class="jobs__date">
      <span class="jobs__date-icon">🕒</span> Expires on: ${new Date(job.expires_at).toLocaleDateString('sr-RS')}
    </p>
    
    ${job.tags && job.tags.length > 0 ? `
      <p class="jobs__tags">
        ${job.tags.map(tag => `<span class="jobs__tag">${tag.name}</span>`).join('')}
      </p>
    ` : ''}
    
    <button class="jobs__bookmark-btn">
      <img src="/static/bookmark.svg" alt="Bookmark">
    </button>
  `;

  // Add click event to bookmark button
  const bookmarkButton = jobItem.querySelector('.jobs__bookmark-btn');
  bookmarkButton?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    bookmarkButton.classList.toggle('active');
  });

  return jobItem;
};