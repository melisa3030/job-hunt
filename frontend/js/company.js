import { CompaniesApi } from './api/companiesApi.js';
import { JobsApi } from './api/jobsApi.js';
import { ReviewsApi } from './api/reviewsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { createJobCard } from './components/jobCard.js';
import { createReviewCard } from './components/reviewCard.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { PerksApi } from './api/perksApi.js';
import { JobTagsApi } from './api/jobTagsApi.js';
import { TagsApi } from './api/tagsApi.js';

export const renderCompanyTab = async (id, tab) => {
  const contentArea = document.getElementById('company-tab-content');

  try {
    // Show loading state
    contentArea.innerHTML = /* HTML */ `
      <div class="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    // Fetch company data and reviews
    const [company, reviews] = await Promise.all([
      CompaniesApi.getCompanyById(id),
      ReviewsApi.getAllReviews(),
    ]);

    // Filter reviews for this company
    const companyReviews = reviews.filter(
      (review) => review.company_id === parseInt(id)
    );

    // Update company header information
    const companyNameElement = document.querySelector('.company__name');
    const companyRatingElement = document.querySelector('.company__rating');

    if (companyNameElement && companyRatingElement) {
      companyNameElement.textContent = company.name;

      const averageRating =
        companyReviews.length > 0
          ? companyReviews.reduce((acc, review) => acc + review.rating, 0) /
            companyReviews.length
          : 0;

      companyRatingElement.innerHTML = `${averageRating.toFixed(1)} ⭐`;
    }

    // Load tab template
    const tabTemplate = await fetch(`/views/company/company-${tab}.html`).then(
      (response) => response.text()
    );
    contentArea.innerHTML = tabTemplate;

    // Initialize tab content based on the selected tab
    switch (tab) {
      case 'about':
        renderAboutTab(company);
        break;
      case 'reviews':
        renderReviewsTab(companyReviews);
        break;
      case 'jobs':
        await renderJobsTab(id);
        break;
      default:
        renderAboutTab(company);
    }
  } catch (error) {
    console.error('Error loading company data:', error);
    contentArea.innerHTML = `
      <div class="alert alert-danger">
        Failed to load company information. Please try again later.
      </div>
    `;
  }
};

function renderAboutTab(company) {
  const aboutContent = document.querySelector('.company-about');
  if (aboutContent) {
    aboutContent.innerHTML = /* HTML */ `
      <div class="company-details">
        <p class="company-description">
          ${company.description || 'No description available.'}
        </p>
        <div class="company-info">
          <p><strong>Location:</strong> ${company.city}, ${company.country}</p>
        </div>
      </div>
    `;
  }
}

function renderReviewsTab(reviews) {
  const reviewsContent = document.querySelector('.company-reviews');
  if (reviewsContent) {
    if (reviews.length === 0) {
      reviewsContent.innerHTML = '<p class="no-reviews">No reviews yet.</p>';
      return;
    }

    const reviewsList = document.createElement('div');
    reviewsList.className = 'reviews__list';

    reviews.forEach((review) => {
      const reviewCard = createReviewCard(review);
      reviewsList.appendChild(reviewCard);
    });

    reviewsContent.innerHTML = '';
    reviewsContent.appendChild(reviewsList);
  }
}

async function renderJobsTab(companyId) {
  const jobsContent = document.querySelector('.company-jobs');
  if (jobsContent) {
    try {
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

      // Filter jobs for this company
      const companyJobs = jobs.filter(
        (job) => job.company_id === parseInt(companyId)
      );

      if (companyJobs.length === 0) {
        jobsContent.innerHTML =
          '<p class="no-jobs">No open positions at this time.</p>';
        return;
      }

      const jobsList = document.createElement('div');
      jobsList.className = 'jobs-list company-jobs-list'; // Add specific class for company jobs

      // Create maps for quick lookups
      const jobTitlesMap = new Map(jobTitles.map((title) => [title.id, title]));
      const categoriesMap = new Map(
        categories.map((category) => [category.id, category])
      );
      const perksMap = new Map(perks.map((perk) => [perk.id, perk]));
      const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));
      const companiesMap = new Map(
        companies.map((company) => [company.id, company])
      );

      // Create a map of job tags
      const jobTagsMap = new Map();
      jobTags.forEach((jobTag) => {
        if (!jobTagsMap.has(jobTag.job_id)) {
          jobTagsMap.set(jobTag.job_id, []);
        }
        jobTagsMap.get(jobTag.job_id).push(tagsMap.get(jobTag.tag_id));
      });

      // Process and render each job
      companyJobs.forEach((job) => {
        job.job_title = jobTitlesMap.get(job.job_title_id);
        job.category = categoriesMap.get(job.category_id);
        if (job.perks) {
          job.perks = job.perks.map((perk_id) => perksMap.get(perk_id));
        }
        job.tags = jobTagsMap.get(job.id) || [];
        job.company = companiesMap.get(job.company_id);

        const jobCard = createJobCard(job, job.job_title);
        jobsList.appendChild(jobCard);
      });

      jobsContent.innerHTML = '';
      jobsContent.appendChild(jobsList);
    } catch (error) {
      console.error('Error loading company jobs:', error);
      jobsContent.innerHTML = /* HTML */ `
        <div class="alert alert-danger">
          Failed to load job listings. Please try again later.
        </div>
      `;
    }
  }
}
