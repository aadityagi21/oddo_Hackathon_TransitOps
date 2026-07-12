import { useEffect, useState } from 'react';
import { getMonthlyExpenses, getTripsByStatus } from '../../api/reportsApi';

function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [monthly, setMonthly] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportsForbidden, setReportsForbidden] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setReportsForbidden(false);
      try {
        const [m, t] = await Promise.all([getMonthlyExpenses(), getTripsByStatus()]);
        setMonthly((m || []).map((r) => ({ label: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`, total: r.total })));
        setTrips((t || []).map((r) => ({ status: r._id, count: r.count })));
      } catch (err) {
        if (err?.response?.status === 403) {
          setReportsForbidden(true);
        } else {
          setError(err?.response?.data?.message || err?.message || 'Failed to load reports');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading reports...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reports</h2>

      {reportsForbidden && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded text-sm text-yellow-800 dark:text-yellow-200">You don't have permission to view reports. Please contact an administrator.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-medium text-gray-900 dark:text-white">Monthly Expenses (last 6 months)</div>
            {!reportsForbidden && (
              <button className="text-sm rounded border px-3 py-1" onClick={() => downloadCSV('monthly-expenses.csv', [['month', 'total'], ...monthly.map((m) => [m.label, m.total])])}>Export CSV</button>
            )}
          </div>
          {reportsForbidden ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">You don't have access to view monthly expenses.</div>
          ) : monthly.length ? (
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300"><th className="p-2">Month</th><th className="p-2">Total</th></tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.label} className="border-t dark:border-gray-700">
                    <td className="p-2 text-gray-900 dark:text-white">{m.label}</td>
                    <td className="p-2 text-gray-900 dark:text-white">{m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">No data</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-medium text-gray-900 dark:text-white">Trips by Status</div>
            {!reportsForbidden && (
              <button className="text-sm rounded border px-3 py-1" onClick={() => downloadCSV('trips-by-status.csv', [['status', 'count'], ...trips.map((t) => [t.status, t.count])])}>Export CSV</button>
            )}
          </div>

          {reportsForbidden ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">You don't have access to view trips by status.</div>
          ) : trips.length ? (
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300"><th className="p-2">Status</th><th className="p-2">Count</th></tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.status} className="border-t dark:border-gray-700">
                    <td className="p-2 text-gray-900 dark:text-white">{t.status}</td>
                    <td className="p-2 text-gray-900 dark:text-white">{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">No data</div>
          )}
        </div>
      </div>

    </div>
  );
}
