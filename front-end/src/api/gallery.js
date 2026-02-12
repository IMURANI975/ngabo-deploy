// api/gallery.js
import { api } from './api';

export const fetchAllGalleryImages = async () => {
  try {
    const { data } = await api.get('/api/gallery');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
};

export const uploadGalleryImage = async (formData) => {
  try {
    // FormData is already created in the component
    // Send it with multipart/form-data content type
    const { data } = await api.post('/api/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data?.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const { data } = await api.delete(`/api/gallery/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const fetchGalleryImageById = async (id) => {
  try {
    const { data } = await api.get(`/api/gallery/${id}`);
    return data?.data;
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    throw error;
  }
};

export const updateGalleryImage = async (id, formData) => {
  try {
    // FormData is already created in the component
    // Send it with multipart/form-data content type
    const { data } = await api.put(`/api/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data?.data;
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};