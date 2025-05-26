import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';

export const ReviewsApi = {
  async getAllReviews() {
    try {
      const response = await fetch(`${BASE_URL}/reviews`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to get reviews');
      }
      return data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  async getReviewById(id) {
    try {
      const response = await fetch(`${BASE_URL}/reviews/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to fetch review');
      }
      return data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  async updateReview(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/reviews/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to update review');
      }
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  async deleteReview(id) {
    try {
      const response = await fetch(`${BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${AuthApi.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', response.status, data);
        throw new Error(data.message || 'Failed to delete review');
      }
      return data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};
