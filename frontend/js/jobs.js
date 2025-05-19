// jobs.js
import { JobsApi } from './api/jobsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { PerksApi } from './api/perksApi.js';
import { createJobCard } from './components/jobCard.js';

export async function renderJobs() {
  const jobsListElement = document.querySelector('.jobs__list');
  if (!jobsListElement) {
    console.error('Element with class .jobs__list not found in the DOM.');
    return;
  }

  try {
    // Show loading state
    jobsListElement.innerHTML = `
      <div class="d-flex justify-content-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    // Fetch all necessary data in parallel
    const [jobs, jobTitles, categories, perks] = await Promise.all([
      JobsApi.getAllJobs(),
      JobTitlesApi.getAllJobTitles(),
      JobCategoriesApi.getAllCategories(),
      PerksApi.getAllPerks()
    ]);

    jobsListElement.innerHTML = '';

    if (!jobs || jobs.length === 0) {
      jobsListElement.innerHTML = `
        <div class="alert alert-info text-center" role="alert">
          No jobs found at the moment.
        </div>
      `;
      return;
    }

    // Create maps for quick lookups
    const jobTitlesMap = new Map(jobTitles.map(title => [title.id, title]));
    const categoriesMap = new Map(categories.map(category => [category.id, category]));
    const perksMap = new Map(perks.map(perk => [perk.id, perk]));

    // Render each job
    jobs.forEach(job => {
      job.job_title = jobTitlesMap.get(job.job_title_id);
      job.category = categoriesMap.get(job.category_id);
      if (job.perks) {
        job.perks = job.perks.map(perk_id => perksMap.get(perk_id));
      }

      const jobCard = createJobCard(job, job.job_title);
      jobsListElement.appendChild(jobCard);
    });

  } catch (error) {
    console.error('Failed to fetch data:', error);
    jobsListElement.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        Failed to load jobs. Please try again later.
      </div>
    `;
  }
}
