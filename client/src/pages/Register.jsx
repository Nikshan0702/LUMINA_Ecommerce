import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E3EF] shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#EDE5F8] text-[#834FD4] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#171719]">
            Create Account
          </h1>
          <p className="text-xs text-[#6B6870]">
            Begin your botanical beauty journey with Lumina Cosmetics
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
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Nimasha Perera"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171719] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171719] mb-1.5">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0771234567"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171719] mb-1.5">
              Password (Min 6 chars) *
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}{' '}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#6B6870] pt-2 border-t border-[#F6F1FB]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#834FD4] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
