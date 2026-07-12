import api from '../services/api';

export async function listExpenses() {
  const res = await api.get('/expenses');
  return res.data.data;
}

export async function createExpense(payload) {
  const res = await api.post('/expenses', payload);
  return res.data.data;
}

export async function updateExpense(id, payload) {
  const res = await api.put(`/expenses/${id}`, payload);
  return res.data.data;
}

export async function deleteExpense(id) {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
}
