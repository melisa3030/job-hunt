/* global bootstrap */
import { PerksApi } from '../api/perksApi.js';

export async function initManageAdminPerks() {
  // ===========================
  // === DOM Elements & State
  // ===========================
  const perksTableBody = document.getElementById('perks-table-body');
  const alertsContainer = document.getElementById('alerts-container');
  const addPerkBtn = document.getElementById('add-perk-btn');

  const perkModal = new bootstrap.Modal(document.getElementById('perk-modal'));
  const perkForm = document.getElementById('perk-form');
  const perkIdInput = document.getElementById('perk-id');
  const perkNameInput = document.getElementById('perk-name');
  const modalTitle = document.getElementById('perk-modal-label');

  let currentPerks = [];

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addPerkBtn.addEventListener('click', () => {
      resetForm();
      perkModal.show();
    });

    perkForm.addEventListener('submit', savePerk);

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    confirmDeleteBtn.addEventListener('click', confirmDeletePerk);
  }

  // ===========================
  // === Data Loading & Display
  // ===========================
  async function loadPerks() {
    try {
      perksTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Loading...</td></tr>';

      const response = await PerksApi.getAllPerks();

      if (response && response.success) {
        currentPerks = response.data || [];
        renderPerks(currentPerks);
      } else {
        throw new Error(response?.error || 'Failed to load perks');
      }
    } catch (error) {
      console.error('Error loading perks:', error);
      showError('Failed to load job perks. Please try again.');
      perksTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center text-danger">Failed to load job perks</td></tr>';
    }
  }

  function renderPerks(perks) {
    perksTableBody.innerHTML = '';

    if (perks.length === 0) {
      perksTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">No job perks found</td></tr>';
      return;
    }

    perks.forEach((perk) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${perk.name}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${perk.id}">
             Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${perk.id}" data-name="${perk.name}">
             Delete
          </button>
        </td>
      `;

      perksTableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => editPerk(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () =>
        openDeleteModal(btn.dataset.id, btn.dataset.name)
      );
    });
  }

  // ===========================
  // === CRUD Operations
  // ===========================
  async function savePerk(event) {
    event.preventDefault();

    if (!perkForm.checkValidity()) {
      event.stopPropagation();
      perkForm.classList.add('was-validated');
      return;
    }

    try {
      const perkData = {
        name: perkNameInput.value.trim(),
      };

      const perkId = perkIdInput.value;
      let response;

      if (perkId) {
        response = await PerksApi.updatePerk(perkId, perkData);
      } else {
        response = await PerksApi.createPerk(perkData);
      }

      if (response && response.success) {
        showSuccess(
          perkId
            ? 'Job perk updated successfully'
            : 'Job perk created successfully'
        );
        perkModal.hide();
        await loadPerks();
      } else {
        throw new Error(response?.error || 'Failed to save job perk');
      }
    } catch (error) {
      console.error('Error saving job perk:', error);
      showError(`Failed to save job perk: ${error.message}`);
    }
  }

  async function confirmDeletePerk() {
    const perkId = document.getElementById('perk-id-to-delete').value;
    if (!perkId) return;

    try {
      const response = await PerksApi.deletePerk(perkId);

      if (response && response.success) {
        showSuccess('Job perk deleted successfully');
        await loadPerks();
      } else {
        throw new Error(response?.error || 'Failed to delete job perk');
      }
    } catch (error) {
      console.error('Error deleting job perk:', error);
      showError(
        'Failed to delete job perk. It may be in use by existing jobs.'
      );
    }
  }

  // ===========================
  // === Modal & Form Functions
  // ===========================
  function resetForm() {
    perkForm.reset();
    perkIdInput.value = '';
    modalTitle.textContent = 'Add Job Perk';
    perkForm.classList.remove('was-validated');
  }

  function editPerk(perkId) {
    const perk = currentPerks.find(
      (p) => p.id.toString() === perkId.toString()
    );
    if (!perk) return;

    perkIdInput.value = perk.id;
    perkNameInput.value = perk.name;
    modalTitle.textContent = 'Edit Job Perk';
    perkForm.classList.remove('was-validated');

    perkModal.show();
  }

  function openDeleteModal(perkId, perkName) {
    const deleteModal = document.getElementById('delete-perk-modal');
    const modalBody = deleteModal.querySelector('.modal-body p');

    if (modalBody) {
      modalBody.textContent = `Are you sure you want to delete the perk "${perkName}"?`;
    }

    document.getElementById('perk-id-to-delete').value = perkId;

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
  await loadPerks();
  setupEventListeners();
}
