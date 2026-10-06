import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@lumina.com');
  const [password, setPassword] = useState('adminpassword123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied: You do not have administrator privileges.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 py-16 text-slate-100">
      <div className="max-w-md w-full bg-slate-800/90 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-sm mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in with administrative credentials to access store operations
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-900/40 border border-rose-700 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/80 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
