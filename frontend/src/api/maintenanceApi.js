import api from '../services/api';

export async function listMaintenance() {
  const res = await api.get('/maintenance');
  return res.data.data;
}

export async function createMaintenance(payload) {
  const res = await api.post('/maintenance', payload);
  return res.data.data;
}

export async function updateMaintenance(id, payload) {
  const res = await api.put(`/maintenance/${id}`, payload);
  return res.data.data;
}

export async function deleteMaintenanceApi(id) {
  const res = await api.delete(`/maintenance/${id}`);
  return res.data;
}
