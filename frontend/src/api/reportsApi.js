import api from '../services/api';

export async function getMonthlyExpenses() {
  const res = await api.get('/reports/monthly-expenses');
  return res.data.data;
}

export async function getTripsByStatus() {
  const res = await api.get('/reports/trips-by-status');
  return res.data.data;
}
