import { JobsApi } from './api/jobsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { PerksApi } from './api/perksApi.js';
import { JobTagsApi } from './api/jobTagsApi.js';
import { TagsApi } from './api/tagsApi.js';
import { createJobCard } from './components/jobCard.js';
import { CompaniesApi } from './api/companiesApi.js';

export async function renderJobs() {
  const jobsListElement = document.querySelector('.jobs__list');
  if (!jobsListElement) {
    console.error('Element with class .jobs__list not found in the DOM.');
    return;
  }

  try {
    // Show loading state
    jobsListElement.innerHTML = `
      <div class="jobs__loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading jobs...</span>
        </div>
      </div>
    `;

    // Fetch all necessary data in parallel
    const [jobs, jobTitles, categories, perks, jobTags, tags, companies] =
      await Promise.all([
        JobsApi.getAllJobs(),
        JobTitlesApi.getAllJobTitles(),
        JobCategoriesApi.getAllJobCategories(),
        PerksApi.getAllPerks(),
        JobTagsApi.getAllJobTags(),
        TagsApi.getAllTags(),
        CompaniesApi.getAllCompanies(),
      ]);

    jobsListElement.innerHTML = '';

    if (!jobs || jobs.length === 0) {
      jobsListElement.innerHTML = `
        <div class="jobs__empty">No jobs found.</div>
      `;
      return;
    }

    // Create maps for quick lookups
    const jobTitlesMap = new Map(jobTitles.map((title) => [title.id, title]));
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category])
    );
    const perksMap = new Map(perks.map((perk) => [perk.id, perk]));
    const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));
    const companiesMap = new Map(companies.map((company) => [company.id, company]));
    console.log(companiesMap);

    // Create a map of job tags
    const jobTagsMap = new Map();
    jobTags.forEach((jobTag) => {
      if (!jobTagsMap.has(jobTag.job_id)) {
        jobTagsMap.set(jobTag.job_id, []);
      }
      jobTagsMap.get(jobTag.job_id).push(tagsMap.get(jobTag.tag_id));
    });

    // Render each job
    jobs.forEach((job) => {
      job.job_title = jobTitlesMap.get(job.job_title_id);
      job.category = categoriesMap.get(job.category_id);
      if (job.perks) {
        job.perks = job.perks.map((perk_id) => perksMap.get(perk_id));
      }
      job.tags = jobTagsMap.get(job.id) || [];
      job.company = companiesMap.get(job.company_id);

      const jobCard = createJobCard(job, job.job_title);
      jobsListElement.appendChild(jobCard);
    });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    jobsListElement.innerHTML = `
      <div class="jobs__error">
        Failed to load jobs. Please try again later.
      </div>
    `;
  }
}
