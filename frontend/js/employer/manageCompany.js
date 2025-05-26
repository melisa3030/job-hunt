import { AuthApi } from '../api/authApi.js';
import { CompaniesApi } from '../api/companiesApi.js';

// TODO: add delete company functionality
export const initManageEmployerCompany = async () => {
  // --- DOM Elements & State ---
  const deleteCompanyBtn = document.getElementById('delete-company-btn');
  const companyContainer = document.getElementById('company-container');
  const loadingIndicator = document.getElementById('loading-company');
  const formTemplate = document.getElementById('company-form-template');
  const detailsTemplate = document.getElementById('company-details-template');

  let currentCompany = null;
  let editCompanyModal = null;

  // ===========================
  // === Form Submission Handlers
  // ===========================

  async function handleEditCompanySubmit(e) {
    e.preventDefault();

    const editFormError = document.getElementById('edit-form-error');
    editFormError.style.display = 'none';

    try {
      const companyData = {
        name: document.getElementById('edit-company-name').value.trim(),
        country: document.getElementById('edit-company-country').value.trim(),
        city: document.getElementById('edit-company-city').value.trim(),
        description: document
          .getElementById('edit-company-description')
          .value.trim(),
      };

      // Validate form data
      if (
        !companyData.name ||
        !companyData.country ||
        !companyData.city ||
        !companyData.description
      ) {
        throw new Error('All fields are required');
      }

      showLoading(true);

      // Update company data
      const result = await CompaniesApi.updateCompany(
        currentCompany.id,
        companyData
      );

      if (result) {
        // The API doesn't return the updated company object, so we need to fetch it again
        currentCompany = await CompaniesApi.getCompanyById(currentCompany.id);

        // Close the modal first
        closeModal('edit-company-modal');

        // Re-render the details section with the fresh data
        renderCompanyDetails();

        showSuccess('Company updated successfully');
      } else {
        throw new Error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      editFormError.textContent =
        error.message || 'Failed to update company. Please try again.';
      editFormError.style.display = 'block';
    } finally {
      showLoading(false);
    }
  }

  async function handleCompanySubmit(e) {
    e.preventDefault();

    const formError = document.getElementById('company-form-error');
    formError.style.display = 'none';

    try {
      const companyData = {
        name: document.getElementById('company-name').value.trim(),
        country: document.getElementById('company-country').value.trim(),
        city: document.getElementById('company-city').value.trim(),
        description: document
          .getElementById('company-description')
          .value.trim(),
      };

      if (
        !companyData.name ||
        !companyData.country ||
        !companyData.city ||
        !companyData.description
      ) {
        throw new Error('All fields are required');
      }

      showLoading(true);
      const result = await CompaniesApi.createCompany(companyData);

      if (result && result.id) {
        // Use the returned company directly
        currentCompany = result;
        renderCompanyDetails();
        showSuccess('Company created successfully');
      } else {
        const user = await AuthApi.getCurrentUser();
        if (user) {
          currentCompany = await CompaniesApi.getCompanyForCurrentEmployer(
            user.id
          );
          renderCompanyDetails();
          showSuccess('Company created successfully');
        } else {
          throw new Error('Failed to retrieve company details');
        }
      }
    } catch (error) {
      console.error('Error creating company:', error);
      formError.textContent =
        error.message || 'Failed to create company. Please try again.';
      formError.style.display = 'block';
    } finally {
      showLoading(false);
    }
  }

  // ===========================
  // === Event Listeners
  // ===========================

  function setupEventListeners() {
    document.addEventListener('click', function (event) {
      // Handle edit button click
      if (
        event.target.id === 'edit-company-btn' ||
        event.target.closest('#edit-company-btn')
      ) {
        openEditModal();
      }
    });

    // Setup form submission using event delegation
    document.addEventListener('submit', function (event) {
      if (event.target.id === 'edit-company-form') {
        event.preventDefault();
        handleEditCompanySubmit(event);
      } else if (event.target.id === 'company-form') {
        event.preventDefault();
        handleCompanySubmit(event);
      }
    });
  }

  // ===========================
  // === Rendering Functions
  // ===========================

  function updateCompanyDisplay() {
    console.log('Updating company display with data:', currentCompany);

    const nameElement = document.getElementById('display-company-name');
    const cityElement = document.getElementById('display-company-city');
    const countryElement = document.getElementById('display-company-country');
    const descriptionElement = document.getElementById(
      'display-company-description'
    );

    if (nameElement) nameElement.textContent = currentCompany.name || '';
    if (cityElement) cityElement.textContent = currentCompany.city || '';
    if (countryElement)
      countryElement.textContent = currentCompany.country || '';
    if (descriptionElement)
      descriptionElement.textContent = currentCompany.description || '';

    console.log('Display elements updated:', {
      name: nameElement?.textContent,
      city: cityElement?.textContent,
      country: countryElement?.textContent,
    });
  }

  const renderCompanyForm = () => {
    companyContainer.innerHTML = '';
    companyContainer.appendChild(formTemplate.content.cloneNode(true));
  };

  const renderCompanyDetails = () => {
    if (!currentCompany) return;

    companyContainer.innerHTML = '';
    companyContainer.appendChild(detailsTemplate.content.cloneNode(true));

    // Display company information
    updateCompanyDisplay();

    // Initialize the Bootstrap modal after the template is rendered
    try {
      const modalElement = document.getElementById('edit-company-modal');
      editCompanyModal = new bootstrap.Modal(modalElement);
    } catch (error) {
      console.error('Error initializing modal:', error);
    }
  };

  // ===========================
  // === Modal Functions
  // ===========================

  function openEditModal() {
    try {
      // Make sure we have current company data
      if (!currentCompany) {
        console.error('Cannot open edit modal: No company data');
        return;
      }

      // Populate modal form with current company data
      document.getElementById('edit-company-name').value =
        currentCompany.name || '';
      document.getElementById('edit-company-country').value =
        currentCompany.country || '';
      document.getElementById('edit-company-city').value =
        currentCompany.city || '';
      document.getElementById('edit-company-description').value =
        currentCompany.description || '';

      // Clear any previous errors
      document.getElementById('edit-form-error').style.display = 'none';

      // Show the modal
      if (editCompanyModal) {
        editCompanyModal.show();
      } else {
        // Try to initialize modal if it doesn't exist
        const modalElement = document.getElementById('edit-company-modal');
        if (modalElement) {
          editCompanyModal = new bootstrap.Modal(modalElement);
          editCompanyModal.show();
        } else {
          console.error('Edit modal element not found');
        }
      }
    } catch (error) {
      console.error('Error opening edit modal:', error);
    }
  }

  function closeModal(modalId) {
    try {
      if (modalId === 'edit-company-modal' && editCompanyModal) {
        editCompanyModal.hide();
      } else {
        const modal = document.getElementById(modalId);
        if (modal) {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  // ===========================
  // === Utility Functions
  // ===========================

  function showLoading(isLoading) {
    if (loadingIndicator) {
      loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
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

    // Clear previous alerts
    alertsContainer.innerHTML = '';
    alertsContainer.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  }

  // ===========================
  // === Data Loading
  // ===========================

  const loadCompanyData = async () => {
    try {
      showLoading(true);

      const user = await AuthApi.getCurrentUser();
      console.log('Log company data for user:', user);

      if (user) {
        try {
          const company = await CompaniesApi.getCompanyByEmployerId(user.id);
          if (company) {
            currentCompany = company;
            renderCompanyDetails();
          } else {
            renderCompanyForm();
          }
        } catch (err) {
          renderCompanyForm();
        }
      }
    } catch (error) {
      console.error('Error loading company data:', error);

      const alertsContainer = document.getElementById('alerts-container');
      if (alertsContainer) {
        alertsContainer.innerHTML = `
                <div class="alert alert-danger">
                  Failed to load company data: ${error.message}
                </div>
              `;
      }
    } finally {
      showLoading(false);
    }
  };

  // ===========================
  // === Initialization
  // ===========================

  await loadCompanyData();
  setupEventListeners();
};
