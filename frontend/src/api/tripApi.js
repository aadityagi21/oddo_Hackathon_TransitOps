import api from '../services/api';

export async function listTrips() {
  const res = await api.get('/trips');
  return res.data.data;
}

export async function createTrip(payload) {
  const res = await api.post('/trips', payload);
  return res.data.data;
}

export async function updateTrip(id, payload) {
  const res = await api.put(`/trips/${id}`, payload);
  return res.data.data;
}

export async function deleteTrip(id) {
  const res = await api.delete(`/trips/${id}`);
  return res.data;
}
