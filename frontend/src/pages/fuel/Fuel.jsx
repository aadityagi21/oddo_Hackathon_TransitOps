import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';
import { listFuel, createFuel, updateFuel, deleteFuel } from '../../api/fuelApi';

function toLocalDatetimeInputValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function Fuel() {
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ vehicle: '', date: '', liters: '', cost: '', odometer: '', notes: '' });
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuthContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, vRes] = await Promise.all([listFuel(), api.get('/vehicles')]);
      setItems(fRes || []);
      setVehicles(vRes.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load fuel logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => setForm({ vehicle: '', date: '', liters: '', cost: '', odometer: '', notes: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        liters: Number(form.liters) || 0,
        cost: Number(form.cost) || 0,
        odometer: Number(form.odometer) || 0,
      };
      if (editingId) {
        await updateFuel(editingId, payload);
      } else {
        await createFuel(payload);
      }
      await fetchData();
      resetForm();
      setEditingId(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (it) => {
    setEditingId(it._id);
    setForm({
      vehicle: it.vehicle?._id || it.vehicle || '',
      date: toLocalDatetimeInputValue(it.date),
      liters: it.liters || '',
      cost: it.cost || '',
      odometer: it.odometer || '',
      notes: it.notes || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this fuel record?')) return;
    try {
      await deleteFuel(id);
      setItems((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const canManage = user && ['admin', 'dispatcher'].includes(user.role);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fuel Logs</h2>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded p-4 shadow-sm">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{editingId ? 'Edit Fuel' : 'Record Fuel'}</h3>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>{v.registrationNumber} — {v.make} {v.model}</option>
            ))}
          </select>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Date</label>
            <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>

          <input type="number" placeholder="Liters" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />

          <input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <input type="number" placeholder="Odometer" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="sm:col-span-2 rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded bg-primary-600 px-4 py-2 text-white" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Save')}</button>
            <button type="button" className="rounded border px-4 py-2" onClick={() => { resetForm(); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="p-2">Vehicle</th>
              <th className="p-2">Date</th>
              <th className="p-2">Liters</th>
              <th className="p-2">Cost</th>
              <th className="p-2">Odometer</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t dark:border-gray-700">
                <td className="p-2 text-gray-900 dark:text-white">{it.vehicle?.registrationNumber || it.vehicle}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.date ? new Date(it.date).toLocaleString() : '-'}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.liters}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.cost}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.odometer}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.notes}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    {canManage && <button className="text-sm rounded bg-yellow-500 px-2 py-1 text-white" onClick={() => onEdit(it)}>Edit</button>}
                    {canManage && <button className="text-sm rounded bg-red-600 px-2 py-1 text-white" onClick={() => onDelete(it._id)}>Delete</button>}
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
