import { useEffect, useState } from 'react';
import { getOverview } from '../../api/dashboardApi';
import { getMonthlyExpenses, getTripsByStatus } from '../../api/reportsApi';

function SmallStat({ label, value }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
      <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function BarChart({ data, labelKey = 'label', valueKey = 'value', height = 120 }) {
  if (!data || data.length === 0) return <div className="p-4">No data</div>;
  const max = Math.max(...data.map((d) => d[valueKey] || 0));
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded">
      {data.map((d) => {
        const percent = max > 0 ? Math.round(((d[valueKey] || 0) / max) * 100) : 0;
        return (
          <div key={d[labelKey]} className="mb-2">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200 mb-1">
              <div>{d[labelKey]}</div>
              <div className="font-medium">{d[valueKey]}</div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded overflow-hidden">
              <div className="bg-primary-600 h-3 rounded" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [tripsByStatus, setTripsByStatus] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [ov, tbs, me] = await Promise.all([getOverview(), getTripsByStatus(), getMonthlyExpenses()]);
        setOverview(ov);
        setTripsByStatus((tbs || []).map((r) => ({ label: r._id || 'unknown', value: r.count || 0 })));
        // monthly expenses: transform { _id: { year, month }, total }
        const months = (me || []).map((r) => {
          const y = r._id.year;
          const m = r._id.month;
          const label = `${y}-${String(m).padStart(2, '0')}`;
          return { label, value: r.total };
        });
        setMonthlyExpenses(months);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SmallStat label="Vehicles" value={overview?.counts?.vehicles ?? '-'} />
        <SmallStat label="Drivers" value={overview?.counts?.drivers ?? '-'} />
        <SmallStat label="Trips" value={overview?.counts?.trips ?? '-'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Trips by status</h3>
            <BarChart data={tripsByStatus} labelKey="label" valueKey="value" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Monthly expenses</h3>
            <BarChart data={monthlyExpenses} labelKey="label" valueKey="value" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Recent activity</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Recent Trips</div>
              {overview?.recent?.trips?.length ? (
                <ul className="text-sm text-gray-900 dark:text-white list-disc list-inside">
                  {overview.recent.trips.map((t) => (
                    <li key={t._id}>{t.title} — {t.vehicle?.registrationNumber || '-'} — {t.status}</li>
                  ))}
                </ul>
              ) : <div className="text-sm text-gray-600 dark:text-gray-300">No recent trips</div>}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Recent Maintenance</div>
              {overview?.recent?.maintenance?.length ? (
                <ul className="text-sm text-gray-900 dark:text-white list-disc list-inside">
                  {overview.recent.maintenance.map((m) => (
                    <li key={m._id}>{m.title} — {m.vehicle?.registrationNumber || '-'} — {m.status}</li>
                  ))}
                </ul>
              ) : <div className="text-sm text-gray-600 dark:text-gray-300">No recent maintenance</div>}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Recent Expenses</div>
              {overview?.recent?.expenses?.length ? (
                <ul className="text-sm text-gray-900 dark:text-white list-disc list-inside">
                  {overview.recent.expenses.map((e) => (
                    <li key={e._id}>{e.category} — {e.amount}</li>
                  ))}
                </ul>
              ) : <div className="text-sm text-gray-600 dark:text-gray-300">No recent expenses</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
