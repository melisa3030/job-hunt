/* global bootstrap */

import { BookmarksApi } from '../api/bookmarksApi.js';

const createToast = (message, type = 'success') => {
  // Create toast container if it doesn't exist
  // This container will hold all toasts and positions them at top-right of screen
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // Generate unique ID for this toast using timestamp
  const toastId = `toast-${Date.now()}`;

  const iconClass = type === 'success' ? 'text-success' : 'text-danger';
  const icon = type === 'success' ? '✓' : '✗';

  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <span class="${iconClass} me-2">${icon}</span>
        <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;

  // Add the toast HTML to the container
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);

  // Initialize Bootstrap toast component with auto-hide after 5 seconds
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 5000,
  });
  toast.show();

  // Clean up: remove toast element from DOM after it's hidden to prevent memory leaks
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
};

const showSuccessToast = (message) => createToast(message, 'success');
const showErrorToast = (message) => createToast(message, 'danger');

// Helper function to update bookmark icon
const updateBookmarkIcon = (img, isBookmarked, isLoading = false) => {
  if (isLoading) {
    // Bootstrap spinner
    img.outerHTML = /* HTML */ `
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    return;
  }

  // If we're coming back from loading state, we need to recreate the img element
  const parent = img.parentElement || img.closest('.jobs__bookmark-btn');
  if (parent.querySelector('.spinner-border')) {
    parent.innerHTML = `
      <img
        src="/static/${isBookmarked ? 'bookmark-filled.svg' : 'bookmark.svg'}"
        alt="${isBookmarked ? 'Bookmarked' : 'Bookmark'}"
      />
    `;
  } else {
    // Normal update
    img.src = `/static/${isBookmarked ? 'bookmark-filled.svg' : 'bookmark.svg'}`;
    img.alt = isBookmarked ? 'Bookmarked' : 'Bookmark';
  }
};

// Helper function to update bookmark arrays
const updateBookmarkArrays = (jobId, bookmarkedJobIds, isAdding) => {
  if (isAdding) {
    if (!bookmarkedJobIds.includes(jobId)) {
      bookmarkedJobIds.push(jobId);
    }
  } else {
    const jobIndex = bookmarkedJobIds.indexOf(jobId);
    if (jobIndex > -1) {
      bookmarkedJobIds.splice(jobIndex, 1);
    }
  }
};

// Main function to create job card
export const createJobCard = (job, jobTitle, bookmarkedJobIds = []) => {
  const jobItem = document.createElement('div');
  jobItem.className = 'jobs__item';
  jobItem.dataset.id = job.id;

  const isBookmarked = bookmarkedJobIds.includes(job.id);

  // Build job card HTML
  jobItem.innerHTML = /* HTML */ `
    <h2 class="jobs__title">${jobTitle?.name || 'Untitled Position'}</h2>
    <p class="jobs__company">
      ${job.company?.name || 'Company Name Not Available'}
    </p>
    <p class="jobs__category">${job.category?.name || 'Uncategorized'}</p>

    ${job.perks?.length > 0
      ? `
      <p class="jobs__perks">
        ${job.perks.map((perk) => `<span class="jobs__perk">${perk.name}</span>`).join(' · ')}
      </p>
    `
      : ''}

    <p class="jobs__location">
      <span class="jobs__location-icon">📍</span> ${job.city}, ${job.country} |
      ${job.work_type}
    </p>

    <p class="jobs__experience">Experience Level: ${job.experience_level}</p>
    <p class="jobs__salary">Salary: $${Number(job.salary).toLocaleString()}</p>
    <p class="jobs__description">${job.description}</p>

    <p class="jobs__date">
      <span class="jobs__date-icon">🕒</span> Expires on:
      ${new Date(job.expires_at).toLocaleDateString('sr-RS')}
    </p>

    ${job.tags?.length > 0
      ? `
      <p class="jobs__tags">
        ${job.tags.map((tag) => `<span class="jobs__tag">${tag.name}</span>`).join('')}
      </p>
    `
      : ''}

    <button class="jobs__bookmark-btn" data-bookmarked="${isBookmarked}">
      <img
        src="/static/${isBookmarked ? 'bookmark-filled.svg' : 'bookmark.svg'}"
        alt="${isBookmarked ? 'Bookmarked' : 'Bookmark'}"
      />
    </button>
  `;

  // Handle bookmark functionality
  const user = JSON.parse(localStorage.getItem('user'));
  const bookmarkBtn = jobItem.querySelector('.jobs__bookmark-btn');

  if (user?.role === 'APPLICANT') {
    bookmarkBtn.addEventListener('click', handleBookmarkClick);
  } else {
    bookmarkBtn.style.display = 'none';
  }

  // Bookmark click handler
  async function handleBookmarkClick(e) {
    e.stopPropagation();

    const img = bookmarkBtn.querySelector('img');
    const currentlyBookmarked = bookmarkBtn.dataset.bookmarked === 'true';

    try {
      // Show loading state
      bookmarkBtn.disabled = true;
      updateBookmarkIcon(img, false, true);

      // Perform bookmark operation
      const result = currentlyBookmarked
        ? await BookmarksApi.deleteBookmark(job.id)
        : await BookmarksApi.createBookmark(job.id);

      if (result.success) {
        // Update UI on success
        const newBookmarkState = !currentlyBookmarked;
        const newImg =
          bookmarkBtn.querySelector('img') ||
          bookmarkBtn.querySelector('.spinner-border');
        updateBookmarkIcon(newImg, newBookmarkState);
        bookmarkBtn.dataset.bookmarked = newBookmarkState.toString();
        updateBookmarkArrays(job.id, bookmarkedJobIds, newBookmarkState);

        const message =
          result.data?.message ||
          (newBookmarkState
            ? 'Job bookmarked successfully!'
            : 'Job bookmark removed successfully!');
        showSuccessToast(message);
      } else {
        showErrorToast(result.error || 'Failed to update bookmark');
        const newImg =
          bookmarkBtn.querySelector('img') ||
          bookmarkBtn.querySelector('.spinner-border');
        updateBookmarkIcon(newImg, currentlyBookmarked);
      }
    } catch (error) {
      console.error('Bookmark operation error:', error);
      showErrorToast('An unexpected error occurred');
      const newImg =
        bookmarkBtn.querySelector('img') ||
        bookmarkBtn.querySelector('.spinner-border');
      updateBookmarkIcon(newImg, currentlyBookmarked);
    } finally {
      bookmarkBtn.disabled = false;
    }
  }

  return jobItem;
};
