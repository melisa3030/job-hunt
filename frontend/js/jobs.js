import { JobsApi } from './api/jobsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { PerksApi } from './api/perksApi.js';
import { JobPerksApi } from './api/jobPerksApi.js';
import { JobTagsApi } from './api/jobTagsApi.js';
import { TagsApi } from './api/tagsApi.js';
import { createJobCard } from './components/jobCard.js';
import { CompaniesApi } from './api/companiesApi.js';

// Store the complete set of jobs and related data
let allJobs = [];
let jobTitlesMap = new Map();
let categoriesMap = new Map();
let perksMap = new Map();
let tagsMap = new Map();
let companiesMap = new Map();
let jobTagsMap = new Map();
let jobPerksMap = new Map();

// Initialize the filtering functionality
export function initJobsFilter() {
  const keywordInput = document.querySelector(
    '.jobs__filter-input[placeholder*="keyword"]'
  );
  const technologyInput = document.querySelector(
    '.jobs__filter-input[placeholder*="Technology"]'
  );
  const locationInput = document.querySelector(
    '.jobs__filter-input[placeholder*="Country / City"]'
  );
  const searchButton = document.querySelector('.jobs__filters__submit-btn');
  const experienceCheckboxes = document.querySelectorAll(
    '.dropdown-menu input[type="checkbox"]'
  );

  // Set up event listeners for filter inputs
  if (keywordInput) {
    keywordInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (technologyInput) {
    technologyInput.addEventListener('input', debounce(applyFilters, 300));
  }

  if (locationInput) {
    locationInput.addEventListener('input', debounce(applyFilters, 300));
  }

  // Add event listeners to experience level checkboxes
  experienceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', applyFilters);
  });

  // Add event listener to search button
  if (searchButton) {
    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
}

export async function renderJobsWithFilters() {
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
    const [
      jobs,
      jobTitles,
      categories,
      perks,
      jobTags,
      tags,
      companies,
      jobPerks,
    ] = await Promise.all([
      JobsApi.getAllJobs(),
      JobTitlesApi.getAllJobTitles(),
      JobCategoriesApi.getAllJobCategories(),
      PerksApi.getAllPerks(),
      JobTagsApi.getAllJobTags(),
      TagsApi.getAllTags(),
      CompaniesApi.getAllCompanies(),
      JobPerksApi.getJobPerks(),
    ]);

    allJobs = jobs || [];

    // Create maps for quick lookups
    jobTitlesMap = new Map(jobTitles.map((title) => [title.id, title]));
    categoriesMap = new Map(
      categories.map((category) => [category.id, category])
    );
    perksMap = new Map(perks.map((perk) => [perk.id, perk]));
    tagsMap = new Map(tags.map((tag) => [tag.id, tag]));
    companiesMap = new Map(companies.map((company) => [company.id, company]));

    // Create a map of job tags
    jobTagsMap = new Map();
    jobTags.forEach((jobTag) => {
      if (!jobTagsMap.has(jobTag.job_id)) {
        jobTagsMap.set(jobTag.job_id, []);
      }
      jobTagsMap.get(jobTag.job_id).push(tagsMap.get(jobTag.tag_id));
    });

    // Create a map of job perks
    jobPerksMap = new Map();
    jobPerks.forEach((jobPerk) => {
      if (!jobPerksMap.has(jobPerk.job_id)) {
        jobPerksMap.set(jobPerk.job_id, []);
      }
      jobPerksMap.get(jobPerk.job_id).push(perksMap.get(jobPerk.perk_id));
    });

    // Display jobs (all jobs initially)
    displayJobs(allJobs);

    // Initialize filter functionality after data is loaded
    initJobsFilter();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    jobsListElement.innerHTML = `
      <div class="jobs__error">
        Failed to load jobs. Please try again later.
      </div>
    `;
  }
}

// Function to display jobs based on filtered data
function displayJobs(jobsToDisplay) {
  const jobsListElement = document.querySelector('.jobs__list');

  jobsListElement.innerHTML = '';

  if (!jobsToDisplay || jobsToDisplay.length === 0) {
    jobsListElement.innerHTML = `
      <div class="jobs__empty">No jobs match your filter criteria.</div>
    `;
    return;
  }

  // Process and render each job
  jobsToDisplay.forEach((job) => {
    // Create a new job object to avoid modifying the original
    const processedJob = { ...job };

    // Enhance job with related data
    processedJob.job_title = jobTitlesMap.get(job.job_title_id);
    processedJob.category = categoriesMap.get(job.category_id);
    processedJob.tags = jobTagsMap.get(job.id) || [];
    processedJob.company = companiesMap.get(job.company_id);

    // Get perks for this job from the jobPerksMap
    processedJob.perks = jobPerksMap.get(job.id) || [];

    const jobCard = createJobCard(processedJob, processedJob.job_title);
    jobsListElement.appendChild(jobCard);
  });
}

// Apply all active filters and update the displayed jobs
function applyFilters() {
  // Get filter values from inputs
  const keyword =
    document
      .querySelector('.jobs__filter-input[placeholder*="keyword"]')
      ?.value.toLowerCase() || '';
  const technology =
    document
      .querySelector('.jobs__filter-input[placeholder*="Technology"]')
      ?.value.toLowerCase() || '';
  const location =
    document
      .querySelector('.jobs__filter-input[placeholder*="Country / City"]')
      ?.value.toLowerCase() || '';

  // Get selected experience levels
  const selectedExperienceLevels = Array.from(
    document.querySelectorAll('.dropdown-menu input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value.toUpperCase());

  // Filter the jobs based on all criteria
  const filteredJobs = allJobs.filter((job) => {
    // Get job title, category and company names for filtering
    const jobTitle = jobTitlesMap.get(job.job_title_id)?.name || '';
    const categoryName = categoriesMap.get(job.category_id)?.name || '';
    const companyName = companiesMap.get(job.company_id)?.name || '';

    // Get all job tags
    const jobTagNames = (jobTagsMap.get(job.id) || [])
      .map((tag) => tag?.name?.toLowerCase() || '')
      .filter((name) => name);

    // Get all job perks
    const jobPerks = (jobPerksMap.get(job.id) || [])
      .map((perk) => perk?.name?.toLowerCase() || '')
      .filter((name) => name);

    // Keyword filter (checks title, company, description, category, perks)
    const keywordMatch =
      keyword === '' ||
      jobTitle.toLowerCase().includes(keyword) ||
      companyName.toLowerCase().includes(keyword) ||
      (job.description && job.description.toLowerCase().includes(keyword)) ||
      categoryName.toLowerCase().includes(keyword) ||
      jobPerks.some((perk) => perk.includes(keyword));

    // Technology filter (checks tags, perks and description)
    const technologyMatch =
      technology === '' ||
      jobTagNames.some((tag) => tag.includes(technology)) ||
      jobPerks.some((perk) => perk.includes(technology)) ||
      (job.description && job.description.toLowerCase().includes(technology));

    // Location filter (checks city and country)
    const locationMatch =
      location === '' ||
      (job.city && job.city.toLowerCase().includes(location)) ||
      (job.country && job.country.toLowerCase().includes(location));

    // Experience level filter
    const experienceLevelMatch =
      selectedExperienceLevels.length === 0 ||
      selectedExperienceLevels.some(
        (level) =>
          job.experience_level &&
          job.experience_level.toUpperCase().includes(level)
      );

    // Return true only if all filters match
    return (
      keywordMatch && technologyMatch && locationMatch && experienceLevelMatch
    );
  });

  // Update the displayed jobs
  displayJobs(filteredJobs);
}

// Utility function to debounce filter inputs (prevents too many updates while typing)
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
