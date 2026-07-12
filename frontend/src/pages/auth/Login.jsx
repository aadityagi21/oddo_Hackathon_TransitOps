import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 card bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Sign in</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-400 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded bg-primary-600 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:underline">Create one</Link>
      </div>
    </div>
  );
}
