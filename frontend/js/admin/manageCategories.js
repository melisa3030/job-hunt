import { JobCategoriesApi } from '../api/jobCategoriesApi.js';

export const initManageAdminCategories = async () => {
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

  function resetForm() {
    categoryForm.reset();
    categoryIdInput.value = '';
    modalTitle.textContent = 'Add Category';
    categoryForm.classList.remove('was-validated');
  }

  async function loadCategories() {
    try {
      categoriesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Loading...</td></tr>';
      const categories = await JobCategoriesApi.getAllJobCategories();
      currentCategories = categories;
      renderCategories(categories);
    } catch (error) {
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
    categories.forEach((cat) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cat.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${cat.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${cat.id}" data-name="${cat.name}">Delete</button>
        </td>
      `;
      categoriesTableBody.appendChild(row);
    });
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editCategory(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        confirmDeleteCategory(btn.dataset.id, btn.dataset.name)
      );
    });
  }

  function editCategory(categoryId) {
    const cat = currentCategories.find(
      (c) => c.id.toString() === categoryId.toString()
    );
    if (!cat) return;
    categoryIdInput.value = cat.id;
    categoryNameInput.value = cat.name;
    modalTitle.textContent = 'Edit Category';
    categoryForm.classList.remove('was-validated');
    categoryModal.show();
  }

  function confirmDeleteCategory(categoryId, categoryName) {
    let deleteModal = document.getElementById('delete-category-modal');
    if (!deleteModal) {
      const modalHtml = `
        <div class="modal fade" id="delete-category-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog"><div class="modal-content">
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
          </div></div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      deleteModal = document.getElementById('delete-category-modal');
      document
        .getElementById('confirm-delete-category')
        .addEventListener('click', async () => {
          await deleteCategory();
          bootstrap.Modal.getInstance(deleteModal).hide();
        });
    }
    document.getElementById('category-to-delete').textContent = categoryName;
    categoryToDelete = categoryId;
    new bootstrap.Modal(deleteModal).show();
  }

  async function deleteCategory() {
    if (!categoryToDelete) return;
    try {
      await JobCategoriesApi.deleteCategory(categoryToDelete);
      showSuccess('Category deleted successfully');
      await loadCategories();
    } catch (error) {
      showError('Failed to delete category.');
    }
    categoryToDelete = null;
  }

  async function saveCategory(event) {
    event.preventDefault();
    if (!categoryForm.checkValidity()) {
      event.stopPropagation();
      categoryForm.classList.add('was-validated');
      return;
    }
    try {
      const categoryData = { name: categoryNameInput.value.trim() };
      const categoryId = categoryIdInput.value;
      if (categoryId) {
        await JobCategoriesApi.updateCategory(categoryId, categoryData);
        showSuccess('Category updated successfully');
      } else {
        await JobCategoriesApi.createCategory(categoryData);
        showSuccess('Category created successfully');
      }
      categoryModal.hide();
      await loadCategories();
    } catch (error) {
      showError(`Failed to save category: ${error.message}`);
    }
  }

  function setupEventListeners() {
    addCategoryBtn.addEventListener('click', () => {
      resetForm();
      categoryModal.show();
    });
    categoryForm.addEventListener('submit', saveCategory);
  }

  await loadCategories();
  setupEventListeners();
};
