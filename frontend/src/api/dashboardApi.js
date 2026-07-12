import api from '../services/api';

export async function getOverview() {
  const res = await api.get('/dashboard/overview');
  return res.data.data;
}
