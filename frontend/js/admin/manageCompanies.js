import { CompaniesApi } from '../api/companiesApi.js';

let currentCompanies = [];
let filteredCompanies = [];
let currentPage = 1;
const itemsPerPage = 10;

export async function initManageCompanies() {
  setupEventListeners();
  await loadCompanies();
}

function setupEventListeners() {
  const searchInput = document.getElementById('company-search');
  searchInput.addEventListener('input', handleSearch);

  const addCompanyBtn = document.getElementById('add-company-btn');
  addCompanyBtn.addEventListener('click', function () {
    openCompanyModal();
  });

  document.querySelectorAll('.close-modal').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });

  const companyForm = document.getElementById('company-form');
  companyForm.addEventListener('submit', handleCompanySubmit);

  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  confirmDeleteBtn.addEventListener('click', confirmDeleteCompany);
}

async function loadCompanies() {
  showLoading(true);

  try {
    const companies = await CompaniesApi.getAllCompanies();
    if (companies) {
      currentCompanies = companies;
      filteredCompanies = [...currentCompanies];
      displayCompanies(currentPage);
      setupPagination();
    } else {
      throw new Error('Failed to fetch companies data');
    }
  } catch (error) {
    console.error('Error loading companies:', error);
    showError('Failed to load companies. Please try again later.');
  } finally {
    showLoading(false);
  }
}

function displayCompanies(page) {
  const companiesTableBody = document.getElementById('companies-table-body');
  if (!companiesTableBody) return;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(start, end);

  companiesTableBody.innerHTML = '';

  if (paginatedCompanies.length === 0) {
    companiesTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No companies found</td>
      </tr>
    `;
    return;
  }

  paginatedCompanies.forEach((company, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${company.id}</td>
      <td>${company.name}</td>
      <td>${company.country || 'N/A'}</td>
      <td>${company.city || 'N/A'}</td>
      <td>${company.description || 'N/A'}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-company-btn" data-company-id="${company.id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger delete-company-btn" data-company-id="${company.id}" data-company-name="${company.name}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;

    companiesTableBody.appendChild(row);
  });

  // Add event listeners to the edit and delete buttons
  document.querySelectorAll('.edit-company-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const companyId = button.getAttribute('data-company-id');
      const company = currentCompanies.find(
        (c) => c.id.toString() === companyId
      );
      if (company) {
        openCompanyModal(company);
      }
    });
  });

  document.querySelectorAll('.delete-company-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const companyId = button.getAttribute('data-company-id');
      openDeleteModal(companyId);
    });
  });
}

function setupPagination() {
  const paginationElement = document.getElementById('companies-pagination');
  if (!paginationElement) return;

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  if (totalPages <= 1) {
    paginationElement.innerHTML = '';
    return;
  }

  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="prev" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="next" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  paginationElement.innerHTML = paginationHTML;

  // Add event listeners to pagination links
  document
    .querySelectorAll('#companies-pagination .page-link')
    .forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.closest('.page-link').getAttribute('data-page');

        if (page === 'prev') {
          if (currentPage > 1) {
            currentPage--;
            displayCompanies(currentPage);
            setupPagination();
          }
        } else if (page === 'next') {
          if (currentPage < totalPages) {
            currentPage++;
            displayCompanies(currentPage);
            setupPagination();
          }
        } else {
          currentPage = parseInt(page);
          displayCompanies(currentPage);
          setupPagination();
        }
      });
    });
}

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();

  if (searchTerm === '') {
    filteredCompanies = [...currentCompanies];
  } else {
    filteredCompanies = currentCompanies.filter((company) => {
      return (
        company.name.toLowerCase().includes(searchTerm) ||
        (company.country &&
          company.country.toLowerCase().includes(searchTerm)) ||
        (company.city && company.city.toLowerCase().includes(searchTerm))
      );
    });
  }

  currentPage = 1;
  displayCompanies(currentPage);
  setupPagination();
}

function openCompanyModal(company = null) {
  const modalTitle = document.getElementById('company-modal-title');
  const companyForm = document.getElementById('company-form');
  const companyModal = document.getElementById('company-modal');

  if (!modalTitle || !companyForm || !companyModal) {
    console.error('Modal elements not found in the DOM');
    return;
  }

  // Reset the form
  companyForm.reset();

  if (company) {
    // Edit existing company
    modalTitle.textContent = 'Edit Company';
    document.getElementById('company-id').value = company.id;
    document.getElementById('company-name').value = company.name || '';
    document.getElementById('company-country').value = company.country || '';
    document.getElementById('company-city').value = company.city || '';
    document.getElementById('company-description').value =
      company.description || '';
  } else {
    // Add new company
    modalTitle.textContent = 'Add Company';
    document.getElementById('company-id').value = '';
  }

  try {
    // Try Bootstrap 5 Modal constructor first
    const bsModal = new bootstrap.Modal(companyModal);
    bsModal.show();
  } catch (error) {
    // Fallback to showing manually
    companyModal.classList.add('show');
    companyModal.style.display = 'block';
    document.body.classList.add('modal-open');

    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
    }
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

async function handleCompanySubmit(e) {
  e.preventDefault();

  const companyId = document.getElementById('company-id').value;
  const companyData = {
    name: document.getElementById('company-name').value,
    country: document.getElementById('company-country').value,
    city: document.getElementById('company-city').value,
    description: document.getElementById('company-description').value,
  };

  // Validation
  if (!companyData.name) {
    showError('Company name is required');
    return;
  }

  try {
    showLoading(true);

    let result;
    if (companyId) {
      // Update existing company
      result = await CompaniesApi.updateCompany(companyId, companyData);
    } else {
      // Create new company
      result = await CompaniesApi.createCompany(companyData);
    }

    if (result) {
      closeAllModals();
      await loadCompanies();
      showSuccess(
        companyId
          ? 'Company updated successfully'
          : 'Company created successfully'
      );
    } else {
      throw new Error(
        companyId ? 'Failed to update company' : 'Failed to create company'
      );
    }
  } catch (error) {
    console.error('Error saving company:', error);
    showError(error.message || 'An error occurred while saving the company');
  } finally {
    showLoading(false);
  }
}

function openDeleteModal(companyId) {
  const company = currentCompanies.find(
    (c) => c.id.toString() === companyId.toString()
  );
  if (!company) return;

  const deleteModal = document.getElementById('delete-company-modal');
  const modalBody = deleteModal.querySelector('.modal-body p');

  if (modalBody) {
    modalBody.textContent = `Are you sure you want to delete the company "${company.name}"? This action cannot be undone.`;
  }

  document.getElementById('company-id-to-delete').value = companyId;

  try {
    const bsModal = new bootstrap.Modal(deleteModal);
    bsModal.show();
  } catch (error) {
    console.error('Error showing delete modal:', error);
    // Fallback to manually showing the modal
    deleteModal.classList.add('show');
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

async function confirmDeleteCompany() {
  const companyId = document.getElementById('company-id-to-delete').value;
  if (!companyId) return;

  try {
    showLoading(true);

    const result = await CompaniesApi.deleteCompany(companyId);

    if (result) {
      closeAllModals();
      await loadCompanies();
      showSuccess('Company deleted successfully');
    } else {
      throw new Error('Failed to delete company');
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    showError(error.message || 'An error occurred while deleting the company');
  } finally {
    showLoading(false);
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    try {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      } else {
        // Fallback manual closing
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');

        // Remove backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  });
}

function showLoading(isLoading) {
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = isLoading ? 'flex' : 'none';
  }
}

function showError(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-danger alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertsContainer.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}

function showSuccess(message) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertsContainer.appendChild(alert);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 300);
  }, 5000);
}
