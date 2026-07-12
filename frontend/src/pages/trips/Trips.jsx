import { useEffect, useState } from 'react';
import { listTrips, createTrip, updateTrip, deleteTrip } from '../../api/tripApi';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

function toLocalDatetimeInputValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', origin: '', destination: '', startTime: '', endTime: '', vehicle: '', driver: '', passengersCount: 0, notes: '' });
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuthContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [t, vRes, dRes] = await Promise.all([
        listTrips(),
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      setTrips(t || []);
      setVehicles(vRes.data.data || []);
      setDrivers(dRes.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => setForm({ title: '', origin: '', destination: '', startTime: '', endTime: '', vehicle: '', driver: '', passengersCount: 0, notes: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...form,
        startTime: form.startTime ? new Date(form.startTime).toISOString() : null,
        endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
      };

      if (editingId) {
        await updateTrip(editingId, payload);
      } else {
        await createTrip(payload);
      }
      await fetchData();
      resetForm();
      setEditingId(null);
    } catch (err) {
      if (err?.response?.status === 409) {
        setError(err.response.data.message || 'Conflict: overlapping trip');
      } else {
        setError(err?.response?.data?.message || err.message || 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title || '',
      origin: t.origin || '',
      destination: t.destination || '',
      startTime: toLocalDatetimeInputValue(t.startTime),
      endTime: toLocalDatetimeInputValue(t.endTime),
      vehicle: t.vehicle?._id || t.vehicle,
      driver: t.driver?._id || t.driver,
      passengersCount: t.passengersCount || 0,
      notes: t.notes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await deleteTrip(id);
      setTrips((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const canManage = user && ['admin', 'dispatcher'].includes(user.role);

  const onDriverUpdateStatus = async (id, status) => {
    try {
      await updateTrip(id, { status });
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Status update failed');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Trips</h2>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded p-4 shadow-sm">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{editingId ? 'Edit Trip' : 'Create Trip'}</h3>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          <input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Start</label>
            <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">End</label>
            <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>

          <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>{v.registrationNumber} — {v.make} {v.model}</option>
            ))}
          </select>

          <select value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>{d.name} — {d.licenseNumber}</option>
            ))}
          </select>

          <input type="number" placeholder="Passengers" value={form.passengersCount} onChange={(e) => setForm({ ...form, passengersCount: Number(e.target.value) })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="sm:col-span-2 rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded bg-primary-600 px-4 py-2 text-white" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update Trip' : 'Create Trip')}</button>
            <button type="button" className="rounded border px-4 py-2" onClick={() => { resetForm(); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="p-2">Title</th>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t._id} className="border-t dark:border-gray-700">
                <td className="p-2 text-gray-900 dark:text-white">{t.title}</td>
                <td className="p-2 text-gray-900 dark:text-white">{t.vehicle?.registrationNumber || t.vehicle}</td>
                <td className="p-2 text-gray-900 dark:text-white">{t.driver?.name || t.driver}</td>
                <td className="p-2 text-gray-900 dark:text-white">{new Date(t.startTime).toLocaleString()}</td>
                <td className="p-2 text-gray-900 dark:text-white">{new Date(t.endTime).toLocaleString()}</td>
                <td className="p-2 text-gray-900 dark:text-white">{t.status}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    {canManage && <button className="text-sm rounded bg-yellow-500 px-2 py-1 text-white" onClick={() => onEdit(t)}>Edit</button>}
                    {canManage && <button className="text-sm rounded bg-red-600 px-2 py-1 text-white" onClick={() => onDelete(t._id)}>Delete</button>}
                    {/* Driver quick status actions */}
                    {user && user.role === 'driver' && String(user._id) === String(t.driver?._id) && (
                      <>
                        {t.status !== 'on_route' && <button className="text-sm rounded bg-indigo-600 px-2 py-1 text-white" onClick={() => onDriverUpdateStatus(t._id, 'on_route')}>Start</button>}
                        {t.status !== 'completed' && <button className="text-sm rounded bg-green-600 px-2 py-1 text-white" onClick={() => onDriverUpdateStatus(t._id, 'completed')}>Complete</button>}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
