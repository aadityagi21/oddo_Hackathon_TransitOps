import { Navigate } from 'react-router-dom';

/**
 * Protected route wrapper – full auth check in Phase 2.
 * Currently allows all access for development.
 */
export default function ProtectedRoute({ children }) {
  // Phase 2: check isAuthenticated from AuthContext
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
