/* global bootstrap */
import { TagsApi } from '../api/tagsApi.js';

export const initManageAdminTags = async () => {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const tagsTableBody = document.getElementById('tags-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const addTagBtn = document.getElementById('add-tag-btn');
  const tagModal = new bootstrap.Modal(document.getElementById('tag-modal'));
  const deleteConfirmModal = new bootstrap.Modal(
    document.getElementById('delete-confirm-modal')
  );
  const tagForm = document.getElementById('tag-form');
  const tagIdInput = document.getElementById('tag-id');
  const tagNameInput = document.getElementById('tag-name');
  const modalTitle = document.getElementById('tag-modal-label');
  const deleteTagNameSpan = document.getElementById('delete-tag-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  let currentTags = [];
  let tagToDelete = null;

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addTagBtn.addEventListener('click', () => {
      resetForm();
      tagModal.show();
    });

    tagForm.addEventListener('submit', saveTag);

    confirmDeleteBtn.addEventListener('click', async () => {
      await deleteTag();
      deleteConfirmModal.hide();
    });
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadTags() {
    try {
      tagsTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Loading...</td></tr>';

      const response = await TagsApi.getAllTags();

      if (response && response.success) {
        currentTags = response.data || [];
        renderTags(currentTags);
      } else {
        throw new Error(response?.error || 'Failed to load tags');
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      showError('Failed to load job tags. Please try again.');
      tagsTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center text-danger">Failed to load job tags</td></tr>';
    }
  }

  function renderTags(tags) {
    tagsTableBody.innerHTML = '';

    if (tags.length === 0) {
      tagsTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">No job tags found</td></tr>';
      return;
    }

    tags.forEach((tag) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tag.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${tag.id}">
             Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${tag.id}" data-name="${tag.name}">
             Delete
          </button>
        </td>
      `;

      tagsTableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editTag(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        confirmDeleteTag(btn.dataset.id, btn.dataset.name)
      );
    });
  }

  // ===========================
  // === CRUD Operations
  // ===========================
  async function saveTag(event) {
    event.preventDefault();

    if (!tagForm.checkValidity()) {
      event.stopPropagation();
      tagForm.classList.add('was-validated');
      return;
    }

    try {
      const tagData = {
        name: tagNameInput.value.trim(),
      };

      const tagId = tagIdInput.value;
      let response;

      if (tagId) {
        response = await TagsApi.updateTag(tagId, tagData);
      } else {
        response = await TagsApi.createTag(tagData);
      }

      if (response && response.success) {
        showSuccess(
          tagId
            ? 'Job tag updated successfully'
            : 'Job tag created successfully'
        );
        tagModal.hide();
        await loadTags();
      } else {
        throw new Error(response?.error || 'Failed to save job tag');
      }
    } catch (error) {
      console.error('Error saving job tag:', error);
      showError(`Failed to save job tag: ${error.message}`);
    }
  }

  async function deleteTag() {
    if (!tagToDelete) return;

    try {
      const response = await TagsApi.deleteTag(tagToDelete);

      if (response && response.success) {
        showSuccess('Job tag deleted successfully');
        await loadTags();
      } else {
        throw new Error(response?.error || 'Failed to delete job tag');
      }
    } catch (error) {
      console.error('Error deleting job tag:', error);
      showError('Failed to delete job tag. It may be in use by existing jobs.');
    }

    tagToDelete = null;
  }

  // ===========================
  // === Modal & Form Functions
  // ===========================
  function resetForm() {
    tagForm.reset();
    tagIdInput.value = '';
    modalTitle.textContent = 'Add Job Tag';
    tagForm.classList.remove('was-validated');
  }
  function editTag(tagId) {
    const tag = currentTags.find((t) => t.id.toString() === tagId.toString());
    if (!tag) return;

    tagIdInput.value = tag.id;
    tagNameInput.value = tag.name;
    modalTitle.textContent = 'Edit Job Tag';
    tagForm.classList.remove('was-validated');

    tagModal.show();
  }

  function confirmDeleteTag(tagId, tagName) {
    deleteTagNameSpan.textContent = tagName;
    tagToDelete = tagId;
    deleteConfirmModal.show();
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
  await loadTags();
  setupEventListeners();
};
