import { JobsApi } from './api/jobsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { PerksApi } from './api/perksApi.js';
import { JobPerksApi } from './api/jobPerksApi.js';
import { JobTagsApi } from './api/jobTagsApi.js';
import { TagsApi } from './api/tagsApi.js';
import { createJobCard } from './components/jobCard.js';
import { CompaniesApi } from './api/companiesApi.js';
import { debounceFilterInput } from './utils/debounceFilterInput.js';
import { extractValidatedData } from './utils/apiResponseUtils.js';

let allJobs = [];

// lookup maps for quick access to related data
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
    keywordInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
  }

  if (technologyInput) {
    technologyInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
  }

  if (locationInput) {
    locationInput.addEventListener(
      'input',
      debounceFilterInput(applyFilters, 300)
    );
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
      jobsResponse,
      jobTitlesResponse,
      categoriesResponse,
      perksResponse,
      jobTagsResponse,
      tagsResponse,
      companiesResponse,
      jobPerksResponse,
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

    // Validate all API responses and extract data using utility
    const jobs = extractValidatedData(jobsResponse, 'jobs');
    const jobTitles = extractValidatedData(jobTitlesResponse, 'job titles');
    const categories = extractValidatedData(categoriesResponse, 'categories');
    const perks = extractValidatedData(perksResponse, 'perks');
    const jobTags = extractValidatedData(jobTagsResponse, 'job tags');
    const tags = extractValidatedData(tagsResponse, 'tags');
    const companies = extractValidatedData(companiesResponse, 'companies');
    const jobPerks = extractValidatedData(jobPerksResponse, 'job perks');

    allJobs = jobs;

    // Build lookup maps with validation
    jobTitlesMap = new Map(
      jobTitles
        .filter((title) => title && title.id && title.name)
        .map((title) => [title.id, title])
    );
    categoriesMap = new Map(
      categories
        .filter((category) => category && category.id && category.name)
        .map((category) => [category.id, category])
    );
    perksMap = new Map(
      perks
        .filter((perk) => perk && perk.id && perk.name)
        .map((perk) => [perk.id, perk])
    );
    tagsMap = new Map(
      tags
        .filter((tag) => tag && tag.id && tag.name)
        .map((tag) => [tag.id, tag])
    );
    companiesMap = new Map(
      companies
        .filter((company) => company && company.id && company.name)
        .map((company) => [company.id, company])
    );

    // Build job tags map with validation
    jobTagsMap = new Map();
    jobTags
      .filter((jobTag) => jobTag && jobTag.job_id && jobTag.tag_id)
      .forEach((jobTag) => {
        if (!jobTagsMap.has(jobTag.job_id)) {
          jobTagsMap.set(jobTag.job_id, []);
        }
        const tag = tagsMap.get(jobTag.tag_id);
        if (tag) {
          jobTagsMap.get(jobTag.job_id).push(tag);
        }
      });

    // Build job perks map with validation
    jobPerksMap = new Map();
    jobPerks
      .filter((jobPerk) => jobPerk && jobPerk.job_id && jobPerk.perk_id)
      .forEach((jobPerk) => {
        if (!jobPerksMap.has(jobPerk.job_id)) {
          jobPerksMap.set(jobPerk.job_id, []);
        }
        const perk = perksMap.get(jobPerk.perk_id);
        if (perk) {
          jobPerksMap.get(jobPerk.job_id).push(perk);
        }
      });

    // Display all jobs initially
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
  jobsToDisplay
    .filter((job) => job && job.id) // Filter out invalid jobs
    .forEach((job) => {
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
  // Get filter values
  const keyword =
    document
      .querySelector('.jobs__filter-input[placeholder*="keyword"]')
      ?.value.trim()
      .toLowerCase() || '';
  const technology =
    document
      .querySelector('.jobs__filter-input[placeholder*="Technology"]')
      ?.value.trim()
      .toLowerCase() || '';
  const location =
    document
      .querySelector('.jobs__filter-input[placeholder*="Country / City"]')
      ?.value.trim()
      .toLowerCase() || '';

  const selectedExperienceLevels = [
    ...document.querySelectorAll(
      '.dropdown-menu input[type="checkbox"]:checked'
    ),
  ].map((checkbox) => checkbox.value.toUpperCase());

  // Filter the jobs based on all criteria
  const filteredJobs = allJobs.filter((job) => {
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
