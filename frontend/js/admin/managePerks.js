import { PerksApi } from '../api/perksApi.js';

export const initManageAdminPerks = async () => {
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
  let perkToDelete = null;

  // ===========================
  // === Event Listeners Setup
  // ===========================
  function setupEventListeners() {
    addPerkBtn.addEventListener('click', () => {
      resetForm();
      perkModal.show();
    });

    perkForm.addEventListener('submit', savePerk);
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
        confirmDeletePerk(btn.dataset.id, btn.dataset.name)
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

  async function deletePerk() {
    if (!perkToDelete) return;

    try {
      const response = await PerksApi.deletePerk(perkToDelete);

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

    perkToDelete = null;
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

  function confirmDeletePerk(perkId, perkName) {
    let deleteModal = document.getElementById('delete-perk-modal');

    if (!deleteModal) {
      const modalHtml = `
        <div class="modal fade" id="delete-perk-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Delete Job Perk</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete the job perk "<span id="perk-to-delete"></span>"?</p>
                <p class="text-danger">This action cannot be undone.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="confirm-delete-perk" class="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      deleteModal = document.getElementById('delete-perk-modal');

      document
        .getElementById('confirm-delete-perk')
        .addEventListener('click', async () => {
          await deletePerk();
          bootstrap.Modal.getInstance(deleteModal).hide();
        });
    }

    document.getElementById('perk-to-delete').textContent = perkName;
    perkToDelete = perkId;

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
  await loadPerks();
  setupEventListeners();
};
