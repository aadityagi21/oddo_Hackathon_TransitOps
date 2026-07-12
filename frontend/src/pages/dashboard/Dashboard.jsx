import { useEffect, useState } from 'react';
import { checkHealth } from '../../api/dashboardApi';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import Loader from '../../components/ui/Loader';

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setApiStatus(data);
      } catch (err) {
        setError(err.message || 'Failed to connect to API');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Fleet operations overview"
      />

      {/* API Connection Status */}
      <div className="mb-8">
        {loading && <Loader />}
        {error && (
          <div className="card border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              API Connection: Offline — {error}
            </p>
            <p className="mt-1 text-xs text-red-600 dark:text-red-500">
              Make sure the backend is running on port 5000 and MongoDB is connected.
            </p>
          </div>
        )}
        {apiStatus && (
          <div className="card border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              API Connection: Online — {apiStatus.message}
            </p>
            <p className="mt-1 text-xs text-green-600 dark:text-green-500">
              Database: {apiStatus.data?.database} | Environment: {apiStatus.data?.environment}
            </p>
          </div>
        )}
      </div>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Active Vehicles" value="—" icon="🚛" color="blue" />
        <StatCard title="Available Vehicles" value="—" icon="✅" color="green" />
        <StatCard title="In Maintenance" value="—" icon="🔧" color="yellow" />
        <StatCard title="Active Trips" value="—" icon="🗺️" color="purple" />
        <StatCard title="Pending Trips" value="—" icon="⏳" color="orange" />
        <StatCard title="Drivers on Duty" value="—" icon="👤" color="indigo" />
        <StatCard title="Fleet Utilization" value="—" icon="📊" color="teal" />
        <StatCard title="Operational Cost" value="—" icon="💰" color="red" />
      </div>
    </div>
  );
}
