import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';
export const JobCategoriesApi = {
  async getAllJobCategories() {
    try {
      const response = await fetch(`${BASE_URL}/job_categories`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || `HTTP error! status: ${response.status}`
          : null,
      };
    } catch (error) {
      console.error('Error fetching job categories:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async getJobCategoryById(id) {
    try {
      const response = await fetch(`${BASE_URL}/job_categories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || `HTTP error! status: ${response.status}`
          : null,
      };
    } catch (error) {
      console.error(`Error fetching job category with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/job_categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || `HTTP error! status: ${response.status}`
          : null,
      };
    } catch (error) {
      console.error('Error creating job category:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await fetch(`${BASE_URL}/job_categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data.message || 'Failed to update category'
          : null,
      };
    } catch (error) {
      console.error(
        `Error updating job category with ID ${categoryId}:`,
        error
      );
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },

  async deleteCategory(categoryId) {
    try {
      const response = await fetch(`${BASE_URL}/job_categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const data = response.status !== 204 ? await response.json() : null;

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok
          ? data?.message || 'Failed to delete category'
          : null,
      };
    } catch (error) {
      console.error(
        `Error deleting job category with ID ${categoryId}:`,
        error
      );
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
