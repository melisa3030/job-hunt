import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

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
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
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
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error(`Error fetching job category with ID ${id}:`, error);
      throw error;
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
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      return data;
    } catch (error) {
      console.error('Error creating job category:', error);
      throw error;
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
      if (!response.ok)
        throw new Error(data.message || 'Failed to update category');
      return data;
    } catch (error) {
      console.error(
        `Error updating job category with ID ${categoryId}:`,
        error
      );
      throw error;
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
      const data = await response.json();
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete category');
      }
      return data;
    } catch (error) {
      console.error(
        `Error deleting job category with ID ${categoryId}:`,
        error
      );
      throw error;
    }
  },
};
