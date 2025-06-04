import { CompaniesApi } from './api/companiesApi.js';
import { JobsApi } from './api/jobsApi.js';
import { ReviewsApi } from './api/reviewsApi.js';
import { JobTitlesApi } from './api/jobTitlesApi.js';
import { JobCategoriesApi } from './api/jobCategoriesApi.js';
import { BookmarksApi } from './api/bookmarksApi.js';
import { ApplicationsApi } from './api/applicationsApi.js';
import { PerksApi } from './api/perksApi.js';
import { JobPerksApi } from './api/jobPerksApi.js';
import { JobTagsApi } from './api/jobTagsApi.js';
import { TagsApi } from './api/tagsApi.js';
import { createJobCard } from './components/jobCard.js';
import { createReviewCard } from './components/reviewCard.js';
import {
  extractValidatedData,
  extractValidatedSingleData,
} from './utils/apiResponseUtils.js';

let bookmarkedJobIds = [];
let appliedJobIds = [];

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
    const [companyResponse, reviewsResponse] = await Promise.all([
      CompaniesApi.getCompanyById(id),
      ReviewsApi.getAllReviews(),
    ]);

    // Validate API responses using utilities
    const company = extractValidatedSingleData(companyResponse, 'company data');
    if (!company) {
      throw new Error('Failed to load company data');
    }

    const reviews = extractValidatedData(reviewsResponse, 'reviews');

    // Filter reviews for this company with validation
    const companyReviews = reviews.filter(
      (review) => review && review.company_id === parseInt(id) && review.rating
    );

    // Update company header information
    const companyNameElement = document.querySelector('.company__name');
    const companyRatingElement = document.querySelector('.company__rating');

    if (companyNameElement && companyRatingElement && company) {
      companyNameElement.textContent = company.name || 'Unknown Company';

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
  if (aboutContent && company) {
    aboutContent.innerHTML = /* HTML */ `
      <div class="company-details">
        <p class="company-description">
          ${company.description || 'No description available.'}
        </p>
        <div class="company-info">
          <p>
            <strong>Location:</strong> ${company.city || 'N/A'},
            ${company.country || 'N/A'}
          </p>
        </div>
      </div>
    `;
  }
}

function renderReviewsTab(reviews) {
  const reviewsContent = document.querySelector('.company-reviews');
  if (reviewsContent) {
    if (!reviews || reviews.length === 0) {
      reviewsContent.innerHTML = '<p class="no-reviews">No reviews yet.</p>';
      return;
    }

    const reviewsList = document.createElement('div');
    reviewsList.className = 'reviews__list';

    reviews
      .filter((review) => review && review.rating) // Filter out invalid reviews
      .forEach((review) => {
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
      const apiCalls = [
        JobsApi.getAllJobs(),
        JobTitlesApi.getAllJobTitles(),
        JobCategoriesApi.getAllJobCategories(),
        PerksApi.getAllPerks(),
        JobTagsApi.getAllJobTags(),
        TagsApi.getAllTags(),
        CompaniesApi.getAllCompanies(),
        JobPerksApi.getJobPerks(),
      ];

      // Add bookmarks and applications API calls if user is authenticated as APPLICANT
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'APPLICANT') {
        apiCalls.push(BookmarksApi.getBookmarkedJobsForCurrentUser());
        apiCalls.push(ApplicationsApi.getApplicationsByCurrentUser());
      }

      const responses = await Promise.all(apiCalls);

      const [
        jobsResponse,
        jobTitlesResponse,
        categoriesResponse,
        perksResponse,
        jobTagsResponse,
        tagsResponse,
        companiesResponse,
        jobPerksResponse,
        bookmarksResponse, // This will be undefined if user is not APPLICANT
        applicationsResponse, // This will be undefined if user is not APPLICANT
      ] = responses;

      // Validate all API responses and extract data using utility
      const jobs = extractValidatedData(jobsResponse, 'jobs');
      const jobTitles = extractValidatedData(jobTitlesResponse, 'job titles');
      const categories = extractValidatedData(categoriesResponse, 'categories');
      const perks = extractValidatedData(perksResponse, 'perks');
      const jobTags = extractValidatedData(jobTagsResponse, 'job tags');
      const tags = extractValidatedData(tagsResponse, 'tags');
      const companies = extractValidatedData(companiesResponse, 'companies');
      const jobPerks = extractValidatedData(jobPerksResponse, 'job perks');

      // Extract bookmarked job IDs if available
      if (
        bookmarksResponse &&
        bookmarksResponse.success &&
        bookmarksResponse.data
      ) {
        bookmarkedJobIds = bookmarksResponse.data.map(
          (bookmark) => bookmark.job_id
        );
      } else {
        bookmarkedJobIds = [];
      }

      // Extract applied job IDs if available
      if (
        applicationsResponse &&
        applicationsResponse.success &&
        applicationsResponse.data
      ) {
        appliedJobIds = applicationsResponse.data.map(
          (application) => application.job_id
        );
      } else {
        appliedJobIds = [];
      }

      // Filter jobs for this company with validation
      const companyJobs = jobs.filter(
        (job) => job && job.company_id === parseInt(companyId)
      );

      if (companyJobs.length === 0) {
        jobsContent.innerHTML =
          '<p class="no-jobs">No open positions at this time.</p>';
        return;
      }

      const jobsList = document.createElement('div');
      jobsList.className = 'jobs-list company-jobs-list'; // Add specific class for company jobs

      // Create maps for quick lookups with validation
      const jobTitlesMap = new Map(
        jobTitles
          .filter((title) => title && title.id && title.name)
          .map((title) => [title.id, title])
      );
      const categoriesMap = new Map(
        categories
          .filter((category) => category && category.id && category.name)
          .map((category) => [category.id, category])
      );
      const perksMap = new Map(
        perks
          .filter((perk) => perk && perk.id && perk.name)
          .map((perk) => [perk.id, perk])
      );
      const tagsMap = new Map(
        tags
          .filter((tag) => tag && tag.id && tag.name)
          .map((tag) => [tag.id, tag])
      );
      const companiesMap = new Map(
        companies
          .filter((company) => company && company.id && company.name)
          .map((company) => [company.id, company])
      );

      // Create a map of job tags with validation
      const jobTagsMap = new Map();
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
      const jobPerksMap = new Map();
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

      // Process and render each job with validation
      companyJobs
        .filter((job) => job && job.id) // Filter out invalid jobs
        .forEach((job) => {
          job.job_title = jobTitlesMap.get(job.job_title_id);
          job.category = categoriesMap.get(job.category_id);
          job.tags = jobTagsMap.get(job.id) || [];
          job.company = companiesMap.get(job.company_id);
          job.perks = jobPerksMap.get(job.id) || [];

          const jobCard = createJobCard(
            job,
            job.job_title,
            bookmarkedJobIds,
            appliedJobIds
          );
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
