import { api } from './api';

export const createAppointment = async (payload) => {
  const { data } = await api.post('/api/appointments', payload);
  return data?.data;
};

export const getAppointments = async () => {
  const { data } = await api.get('/api/appointments');
  return data?.data;
};
