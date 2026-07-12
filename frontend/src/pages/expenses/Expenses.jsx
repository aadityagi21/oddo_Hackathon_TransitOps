import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';
import { listExpenses, createExpense, updateExpense, deleteExpense } from '../../api/expenseApi';

function toLocalDateInputValue(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', category: '', amount: '', vehicle: '', note: '', receiptUrl: '' });
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuthContext();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, vRes] = await Promise.all([listExpenses(), api.get('/vehicles')]);
      setItems(eRes || []);
      setVehicles(vRes.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => setForm({ date: '', category: '', amount: '', vehicle: '', note: '', receiptUrl: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        amount: Number(form.amount) || 0,
      };
      if (editingId) {
        await updateExpense(editingId, payload);
      } else {
        await createExpense(payload);
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
      date: toLocalDateInputValue(it.date),
      category: it.category || '',
      amount: it.amount || '',
      vehicle: it.vehicle?._id || it.vehicle || '',
      note: it.note || '',
      receiptUrl: it.receiptUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      setItems((s) => s.filter((x) => x._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const canManage = user && ['admin', 'dispatcher', 'financial_analyst'].includes(user.role);

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Expenses</h2>

      <div className="mb-6 bg-white dark:bg-gray-800 rounded p-4 shadow-sm">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{editingId ? 'Edit Expense' : 'Record Expense'}</h3>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200">Date</label>
            <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
          </div>

          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />

          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />

          <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Associated vehicle (optional)</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>{v.registrationNumber} — {v.make} {v.model}</option>
            ))}
          </select>

          <input placeholder="Receipt URL (optional)" value={form.receiptUrl} onChange={(e) => setForm({ ...form, receiptUrl: e.target.value })} className="rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <textarea placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="sm:col-span-2 rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded bg-primary-600 px-4 py-2 text-white" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
            <button type="button" className="rounded border px-4 py-2" onClick={() => { resetForm(); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow-sm overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Receipt</th>
              <th className="p-2">Note</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t dark:border-gray-700">
                <td className="p-2 text-gray-900 dark:text-white">{it.date ? new Date(it.date).toLocaleString() : '-'}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.category}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.amount}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.vehicle?.registrationNumber || '-'}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.receiptUrl ? <a href={it.receiptUrl} target="_blank" rel="noreferrer" className="text-primary-600">View</a> : '-'}</td>
                <td className="p-2 text-gray-900 dark:text-white">{it.note}</td>
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
