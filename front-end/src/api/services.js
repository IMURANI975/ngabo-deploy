import { api } from './api';

export const fetchAllServices = async () => {
  try {
    const { data } = await api.get('/api/services');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchServiceById = async (id) => {
  try {
    const { data } = await api.get(`/api/services/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const createService = async (formData) => {
  try {
    const { data } = await api.post('/api/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data?.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id, formData) => {
  try {
    const { data } = await api.put(`/api/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data?.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const { data } = await api.delete(`/api/services/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};