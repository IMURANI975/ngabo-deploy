import { api } from './api';

export const createContact = async (payload) => {
  const { data } = await api.post('/api/contacts', payload);
  return data?.data;
};
