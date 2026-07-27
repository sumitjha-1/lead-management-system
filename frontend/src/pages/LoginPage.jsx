import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const LoginPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // If already logged in, redirect straight to the correct dashboard
  if (!loading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'} replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      navigate(loggedInUser.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-between items-center p-6">
        <Link to="/" className="flex items-center gap-2 text-text-primary font-bold text-lg">
          <FiTrendingUp className="text-primary" size={22} />
          LeadFlow
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-brand shadow-sm p-8">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-6">Log in to your account to continue.</p>

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-brand bg-danger/10 border border-danger text-danger text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-brand border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-danger' : 'border-border'
                  }`}
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-brand border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password ? 'border-danger' : 'border-border'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-brand bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;