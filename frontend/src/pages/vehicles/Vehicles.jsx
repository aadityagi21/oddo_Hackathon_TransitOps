import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ make: '', model: '', registrationNumber: '', capacity: 0 });
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const canManage = user && ['admin', 'dispatcher'].includes(user.role);

  const onCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/vehicles', form);
      setForm({ make: '', model: '', registrationNumber: '', capacity: 0 });
      fetchVehicles();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create vehicle');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vehicles</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {canManage && (
        <form onSubmit={onCreate} className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            placeholder="Make"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            className="rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              className="w-full rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button type="submit" className="rounded bg-primary-600 px-4 py-2 text-white">Create</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow-sm">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-300">
              <th className="p-2">Registration</th>
              <th className="p-2">Make / Model</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id} className="border-t dark:border-gray-700">
                <td className="p-2 text-gray-900 dark:text-white">{v.registrationNumber}</td>
                <td className="p-2 text-gray-900 dark:text-white">{v.make} {v.model}</td>
                <td className="p-2 text-gray-900 dark:text-white">{v.capacity}</td>
                <td className="p-2 text-gray-900 dark:text-white">{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
