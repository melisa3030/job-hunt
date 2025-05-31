/* global bootstrap */
import { JobCategoriesApi } from '../api/jobCategoriesApi.js';

export async function initManageAdminCategories() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const categoriesTableBody = document.getElementById('categories-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoryModal = new bootstrap.Modal(
    document.getElementById('category-modal')
  );
  const categoryForm = document.getElementById('category-form');
  const categoryIdInput = document.getElementById('category-id');
  const categoryNameInput = document.getElementById('category-name');
  const modalTitle = document.getElementById('category-modal-label');
  const deleteModal = new bootstrap.Modal(
    document.getElementById('delete-category-modal')
  );

  let currentCategories = [];

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addCategoryBtn.addEventListener('click', handleAddCategory);
    categoryForm.addEventListener('submit', handleFormSubmit);

    // Add delete confirmation event listener
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    confirmDeleteBtn.addEventListener('click', confirmDeleteCategory);
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadCategories() {
    try {
      categoriesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Loading...</td></tr>';
      const response = await JobCategoriesApi.getAllJobCategories();

      if (response && response.success) {
        currentCategories = response.data || [];
        renderCategories(currentCategories);
      } else {
        throw new Error(response?.error || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showError('Failed to load categories.');
      categoriesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center text-danger">Failed to load categories</td></tr>';
    }
  }

  function renderCategories(categories) {
    categoriesTableBody.innerHTML = '';

    if (categories.length === 0) {
      categoriesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">No categories found</td></tr>';
      return;
    }

    categories.forEach((category) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${category.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${category.id}">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${category.id}" data-name="${category.name}">
            Delete
          </button>
        </td>
      `;
      categoriesTableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleEditCategory(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        handleDeleteCategory(btn.dataset.id, btn.dataset.name)
      );
    });
  }

  // ===========================
  // === CRUD Operations
  // ===========================
  async function saveCategory(categoryData, categoryId) {
    try {
      let response;

      if (categoryId) {
        response = await JobCategoriesApi.updateCategory(
          categoryId,
          categoryData
        );
      } else {
        response = await JobCategoriesApi.createCategory(categoryData);
      }

      if (response && response.success) {
        showSuccess(
          categoryId
            ? 'Category updated successfully'
            : 'Category created successfully'
        );
        categoryModal.hide();
        await loadCategories();
      } else {
        throw new Error(response?.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showError(`Failed to save category: ${error.message}`);
    }
  }

  async function deleteCategory(categoryId) {
    if (!categoryId) return;

    try {
      const response = await JobCategoriesApi.deleteCategory(categoryId);

      if (response && response.success) {
        showSuccess('Category deleted successfully');
        await loadCategories();
      } else {
        throw new Error(response?.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Failed to delete category.');
    }
  }

  async function confirmDeleteCategory() {
    const categoryId = document.getElementById('category-id-to-delete').value;
    await deleteCategory(categoryId);
    deleteModal.hide();
  }

  // ===========================
  // === Modal & Form Functions
  // ===========================
  function resetForm() {
    categoryForm.reset();
    categoryIdInput.value = '';
    modalTitle.textContent = 'Add Category';
    categoryForm.classList.remove('was-validated');
  }

  function openDeleteModal(categoryId, categoryName) {
    const modalBody = deleteModal._element.querySelector('.modal-body p');

    if (modalBody) {
      modalBody.textContent = `Are you sure you want to delete the category "${categoryName}"?`;
    }

    document.getElementById('category-id-to-delete').value = categoryId;

    try {
      deleteModal.show();
    } catch (error) {
      console.error('Error showing delete modal:', error);
      // Fallback to manually showing the modal
      const modalElement = document.getElementById('delete-category-modal');
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');

      // Create backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  function handleAddCategory() {
    resetForm();
    categoryModal.show();
  }

  function handleEditCategory(categoryId) {
    const category = currentCategories.find(
      (c) => c.id.toString() === categoryId.toString()
    );
    if (!category) return;

    categoryIdInput.value = category.id;
    categoryNameInput.value = category.name;
    modalTitle.textContent = 'Edit Category';
    categoryForm.classList.remove('was-validated');
    categoryModal.show();
  }

  function handleDeleteCategory(categoryId, categoryName) {
    openDeleteModal(categoryId, categoryName);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!categoryForm.checkValidity()) {
      event.stopPropagation();
      categoryForm.classList.add('was-validated');
      return;
    }

    const categoryData = { name: categoryNameInput.value.trim() };
    const categoryId = categoryIdInput.value;
    await saveCategory(categoryData, categoryId);
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
  await loadCategories();
  setupEventListeners();
}
