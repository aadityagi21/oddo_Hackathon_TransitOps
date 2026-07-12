import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', licenseNumber: '', phone: '' });
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const canManage = user && ['admin', 'dispatcher'].includes(user.role);

  const onCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/drivers', form);
      setForm({ name: '', licenseNumber: '', phone: '' });
      fetchDrivers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create driver');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Drivers</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {canManage && (
        <form onSubmit={onCreate} className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded border px-3 py-2"
            required
          />
          <input
            placeholder="License Number"
            value={form.licenseNumber}
            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
            className="rounded border px-3 py-2"
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded border px-3 py-2"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded bg-primary-600 px-4 py-2 text-white">Create</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-2">Name</th>
              <th className="p-2">License</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.licenseNumber}</td>
                <td className="p-2">{d.phone}</td>
                <td className="p-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
