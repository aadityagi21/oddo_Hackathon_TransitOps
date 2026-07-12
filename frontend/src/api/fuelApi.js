import api from '../services/api';

export async function listFuel() {
  const res = await api.get('/fuel');
  return res.data.data;
}

export async function createFuel(payload) {
  const res = await api.post('/fuel', payload);
  return res.data.data;
}

export async function updateFuel(id, payload) {
  const res = await api.put(`/fuel/${id}`, payload);
  return res.data.data;
}

export async function deleteFuel(id) {
  const res = await api.delete(`/fuel/${id}`);
  return res.data;
}
