import { BASE_URL } from '../constants/constants.js';

export const ReviewsApi = {
  async getAllReviews() {
    try {
      const response = await fetch(`${BASE_URL}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }
};

