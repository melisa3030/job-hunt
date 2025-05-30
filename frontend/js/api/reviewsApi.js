import { BASE_URL } from '../constants/constants.js';
import { AuthApi } from './authApi.js';
import { logServerResponse } from '../utils/logging/logServerResponse.js';

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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to get reviews' : null,
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data.message || 'Failed to fetch review' : null,
      };
    } catch (error) {
      console.error('Error fetching review:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      const resData = await response.json();

      logServerResponse(response, resData);

      return {
        success: response.ok,
        data: response.ok ? resData : null,
        error: !response.ok
          ? resData.message || 'Failed to update review'
          : null,
      };
    } catch (error) {
      console.error('Error updating review:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
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

      const data = response.status !== 204 ? await response.json() : null;

      logServerResponse(response, data);

      return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data?.message || 'Failed to delete review' : null,
      };
    } catch (error) {
      console.error('Error deleting review:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Network error occurred',
      };
    }
  },
};
