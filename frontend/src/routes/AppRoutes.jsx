import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/dashboard/Dashboard';
import Login from '../pages/auth/Login';

/** Placeholder pages – implemented in upcoming phases */
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
    <p className="mt-2 text-gray-500 dark:text-gray-400">Coming in the next phase.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<PlaceholderPage title="Vehicle Registry" />} />
        <Route path="/drivers" element={<PlaceholderPage title="Driver Management" />} />
        <Route path="/trips" element={<PlaceholderPage title="Trip Management" />} />
        <Route path="/maintenance" element={<PlaceholderPage title="Maintenance" />} />
        <Route path="/fuel" element={<PlaceholderPage title="Fuel Logs" />} />
        <Route path="/expenses" element={<PlaceholderPage title="Expenses" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
      </Route>
    </Routes>
  );
}
