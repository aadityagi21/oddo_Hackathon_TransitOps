import { createContext, useContext } from 'react';

/**
 * Auth context placeholder – full implementation in Phase 2.
 * For now, provides a mock authenticated state so the layout renders.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const value = {
    user: null,
    token: null,
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    loading: false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
