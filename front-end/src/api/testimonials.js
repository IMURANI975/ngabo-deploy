// api/testimonials.js
import { api } from './api';

export const fetchAllTestimonials = async () => {
  try {
    const { data } = await api.get('/api/testimonials');
    // If backend returns array directly, just return it
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const { data } = await api.post('/api/testimonials', testimonialData);
    return data?.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (id, testimonialData) => {
  try {
    const { data } = await api.patch(`/api/testimonials/${id}`, testimonialData);
    return data?.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const { data } = await api.delete(`/api/testimonials/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};