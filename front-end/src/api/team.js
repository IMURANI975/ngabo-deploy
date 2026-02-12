import { api } from './api';

export const fetchTeam = async () => {
  const { data } = await api.get('/api/team');
  return data?.data;
};
