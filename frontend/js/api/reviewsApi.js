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
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to get reviews');
      }
      return response.json();
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
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to fetch review');
      }
      return response.json();
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
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to update review');
      }
      return response.json();
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
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error('Failed to delete review');
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};
