import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E3EF] shadow-card space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="/logo.png" 
            alt="Lumina Cosmetics" 
            className="w-16 h-16 rounded-full object-cover mx-auto mb-2 shadow-sm ring-2 ring-[#EDE5F8]" 
          />
          <h1 className="text-3xl font-bold text-[#171719]">
            Welcome back.
          </h1>
          <p className="text-xs text-[#6B6870]">
            Continue your beauty journey with Lumina Cosmetics
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-[#E11D48] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#171719] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171719] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Helper */}
        <div className="pt-3 border-t border-[#F6F1FB] space-y-2">
          <p className="text-[10px] font-bold text-[#6B6870] uppercase tracking-wider text-center">
            One-Click Assessment Evaluator Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@lumina.com', 'adminpassword123')}
              className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer@example.com', 'customerpassword123')}
              className="p-2.5 rounded-xl bg-[#EDE5F8] hover:bg-[#DFCFF4] text-[#834FD4] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Demo Customer
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#6B6870] pt-1">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-[#834FD4] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
