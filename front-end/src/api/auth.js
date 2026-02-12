import { api } from './api';

export const adminLogin = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
};

export const adminMe = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};

