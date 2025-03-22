import { jobs, jobTitles, companies, jobCategories, perks, jobPerks, tags, jobTags } from './mockData.js';
console.log(jobs);

export function renderJobs() {
  const jobsListElement = document.querySelector('.jobs__list');
  if (!jobsListElement) {
    console.error('Element with class .jobs__list not found in the DOM.');
    return;
  }
  jobsListElement.innerHTML = '';

  jobs.forEach((job) => {
    const jobItem = document.createElement('div');
    jobItem.className = 'jobs__item';
    jobItem.dataset.id = job.id;

    const jobTitle = jobTitles.find((title) => title.id === job.job_title_id).name;
    const company = companies.find((company) => company.id === job.company_id).name;
    const category = jobCategories.find((category) => category.id === job.category_id).name;
    const jobPerksList = jobPerks.filter((jp) => jp.job_id === job.id).map((jp) => perks.find((perk) => perk.id === jp.perk_id).name);
    const jobTagsList = jobTags.filter((jt) => jt.job_id === job.id).map((jt) => tags.find((tag) => tag.id === jt.tag_id).name);

    const jobTitleElement = document.createElement('h2');
    jobTitleElement.className = 'jobs__title';
    jobTitleElement.textContent = jobTitle;

    const jobCompanyElement = document.createElement('p');
    jobCompanyElement.className = 'jobs__company';
    jobCompanyElement.textContent = company;

    const jobCategoryElement = document.createElement('p');
    jobCategoryElement.className = 'jobs__category';
    jobCategoryElement.textContent = category;

    const jobPerksElement = document.createElement('p');
    jobPerksElement.className = 'jobs__perks';
    jobPerksElement.innerHTML = jobPerksList.map((perk) => `<span class="jobs__perk">${perk}</span>`).join(' · ');

    const jobLocationElement = document.createElement('p');
    jobLocationElement.className = 'jobs__location';
    jobLocationElement.innerHTML = `<span class="jobs__location-icon">📍</span> ${job.city}, ${job.country} | ${job.work_type}`;

    const jobExperienceElement = document.createElement('p');
    jobExperienceElement.className = 'jobs__experience';
    jobExperienceElement.textContent = `Experience Level: ${job.experience_level}`;

    const jobSalaryElement = document.createElement('p');
    jobSalaryElement.className = 'jobs__salary';
    jobSalaryElement.textContent = `Salary: $${job.salary.toLocaleString()}`;

    const jobDescriptionElement = document.createElement('p');
    jobDescriptionElement.className = 'jobs__description';
    jobDescriptionElement.textContent = job.description;

    const jobDateElement = document.createElement('p');
    jobDateElement.className = 'jobs__date';
    jobDateElement.innerHTML = `<span class="jobs__date-icon">🕒</span> Expires on: ${new Date(job.expires_at).toLocaleDateString('sr-RS')}`;

    const jobTagsElement = document.createElement('p');
    jobTagsElement.className = 'jobs__tags';
    jobTagsElement.innerHTML = jobTagsList.map((tag) => `<span class="jobs__tag">${tag}</span>`).join('');

    const bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'jobs__bookmark-btn';
    bookmarkButton.innerHTML = '<img src="/static/bookmark.svg" alt="Bookmark">';

    jobItem.append(
      jobTitleElement,
      jobCompanyElement,
      jobCategoryElement,
      jobPerksElement,
      jobLocationElement,
      jobExperienceElement,
      jobSalaryElement,
      jobDescriptionElement,
      jobDateElement,
      jobTagsElement,
      bookmarkButton
    );
    jobsListElement.appendChild(jobItem);
  });
}