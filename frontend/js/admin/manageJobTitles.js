/* global bootstrap */
import { JobTitlesApi } from '../api/jobTitlesApi.js';

export const initManageAdminJobTitles = async () => {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const titlesTableBody = document.getElementById('titles-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const addTitleBtn = document.getElementById('add-title-btn');

  const titleModal = new bootstrap.Modal(
    document.getElementById('title-modal')
  );
  const titleForm = document.getElementById('title-form');
  const titleIdInput = document.getElementById('title-id');
  const titleNameInput = document.getElementById('title-name');
  const modalTitle = document.getElementById('title-modal-label');

  let currentTitles = [];
  let titleToDelete = null;

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addTitleBtn.addEventListener('click', () => {
      resetForm();
      titleModal.show();
    });

    titleForm.addEventListener('submit', saveJobTitle);
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadJobTitles() {
    try {
      titlesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Loading...</td></tr>';

      const response = await JobTitlesApi.getAllJobTitles();

      if (response && response.success) {
        currentTitles = response.data || [];
        renderJobTitles(currentTitles);
      } else {
        throw new Error(response?.error || 'Failed to load job titles');
      }
    } catch (error) {
      console.error('Error loading job titles:', error);
      showError('Failed to load job titles. Please try again.');
      titlesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center text-danger">Failed to load job titles</td></tr>';
    }
  }

  function renderJobTitles(titles) {
    titlesTableBody.innerHTML = '';

    if (titles.length === 0) {
      titlesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">No job titles found</td></tr>';
      return;
    }

    titles.forEach((title) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${title.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${title.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${title.id}" data-name="${title.name}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </td>
      `;

      titlesTableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editJobTitle(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        confirmDeleteJobTitle(btn.dataset.id, btn.dataset.name)
      );
    });
  }

  // ===========================
  // === CRUD Operations
  // ===========================
  async function saveJobTitle(event) {
    event.preventDefault();

    if (!titleForm.checkValidity()) {
      event.stopPropagation();
      titleForm.classList.add('was-validated');
      return;
    }

    try {
      const titleData = {
        name: titleNameInput.value.trim(),
      };

      const titleId = titleIdInput.value;
      let response;

      if (titleId) {
        response = await JobTitlesApi.updateJobTitle(titleId, titleData);
      } else {
        response = await JobTitlesApi.createJobTitle(titleData);
      }

      if (response && response.success) {
        showSuccess(
          titleId
            ? 'Job title updated successfully'
            : 'Job title created successfully'
        );
        titleModal.hide();
        await loadJobTitles();
      } else {
        throw new Error(response?.error || 'Failed to save job title');
      }
    } catch (error) {
      console.error('Error saving job title:', error);
      showError(`Failed to save job title: ${error.message}`);
    }
  }

  async function deleteJobTitle() {
    if (!titleToDelete) return;

    try {
      const response = await JobTitlesApi.deleteJobTitle(titleToDelete);

      if (response && response.success) {
        showSuccess('Job title deleted successfully');
        await loadJobTitles();
      } else {
        throw new Error(response?.error || 'Failed to delete job title');
      }
    } catch (error) {
      console.error('Error deleting job title:', error);
      showError(
        'Failed to delete job title. It may be in use by existing jobs.'
      );
    }

    titleToDelete = null;
  }

  // ===========================
  // === Modal & Form Functions
  // ===========================
  function resetForm() {
    titleForm.reset();
    titleIdInput.value = '';
    modalTitle.textContent = 'Add Job Title';
    titleForm.classList.remove('was-validated');
  }

  function editJobTitle(titleId) {
    const title = currentTitles.find(
      (t) => t.id.toString() === titleId.toString()
    );
    if (!title) return;

    titleIdInput.value = title.id;
    titleNameInput.value = title.name;
    modalTitle.textContent = 'Edit Job Title';
    titleForm.classList.remove('was-validated');

    titleModal.show();
  }

  function confirmDeleteJobTitle(titleId, titleName) {
    let deleteModal = document.getElementById('delete-title-modal');

    if (!deleteModal) {
      const modalHtml = `
        <div class="modal fade" id="delete-title-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Delete Job Title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete the job title "<span id="title-to-delete"></span>"?</p>
                <p class="text-danger">This action cannot be undone.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="confirm-delete-title" class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      deleteModal = document.getElementById('delete-title-modal');

      document
        .getElementById('confirm-delete-title')
        .addEventListener('click', async () => {
          await deleteJobTitle();
          bootstrap.Modal.getInstance(deleteModal).hide();
        });
    }

    document.getElementById('title-to-delete').textContent = titleName;
    titleToDelete = titleId;

    new bootstrap.Modal(deleteModal).show();
  }

  // ===========================
  // === Utility Functions
  // ===========================
  function showSuccess(message) {
    alertsContainer.innerHTML = '';
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertsContainer.appendChild(alert);
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  function showError(message) {
    alertsContainer.innerHTML = '';
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertsContainer.appendChild(alert);
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  // ===========================
  // === Initialization
  // ===========================
  await loadJobTitles();
  setupEventListeners();
};
