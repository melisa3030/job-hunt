import { JobCategoriesApi } from '../api/jobCategoriesApi.js';

export const initManageAdminCategories = async () => {
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

  let currentCategories = [];
  let categoryToDelete = null;

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addCategoryBtn.addEventListener('click', handleAddCategory);
    categoryForm.addEventListener('submit', handleFormSubmit);
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

  async function deleteCategory() {
    if (!categoryToDelete) return;

    try {
      const response = await JobCategoriesApi.deleteCategory(categoryToDelete);

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
    categoryToDelete = null;
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

  function createDeleteModal() {
    const modalHtml = `
      <div class="modal fade" id="delete-category-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Delete Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete the category "<span id="category-to-delete"></span>"?</p>
              <p class="text-danger">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" id="confirm-delete-category" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const deleteModal = document.getElementById('delete-category-modal');
    document
      .getElementById('confirm-delete-category')
      .addEventListener('click', async () => {
        await deleteCategory();
        bootstrap.Modal.getInstance(deleteModal).hide();
      });

    return deleteModal;
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
    let deleteModal = document.getElementById('delete-category-modal');
    if (!deleteModal) {
      deleteModal = createDeleteModal();
    }

    document.getElementById('category-to-delete').textContent = categoryName;
    categoryToDelete = categoryId;
    new bootstrap.Modal(deleteModal).show();
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
};
