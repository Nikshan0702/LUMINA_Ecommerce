import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E3EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#EDE5F8] text-[#834FD4] flex items-center justify-center transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#171719] leading-none">
                LUMINA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#6B6870] uppercase font-medium mt-1">
                Cosmetics & Beauty
              </span>
            </div>
          </Link>

          {/* CENTER: Minimal Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6870]">
            <Link to="/products" className="hover:text-[#171719] transition-colors">
              Shop
            </Link>
            <Link to="/products?category=Skincare" className="hover:text-[#171719] transition-colors">
              Skincare
            </Link>
            <Link to="/products?category=Haircare" className="hover:text-[#171719] transition-colors">
              Haircare
            </Link>
            <Link to="/products?category=Makeup" className="hover:text-[#171719] transition-colors">
              Makeup
            </Link>
            <Link to="/products" className="hover:text-[#171719] transition-colors">
              About
            </Link>
          </nav>

          {/* RIGHT: Search, Account, Cart Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon Shortcut */}
            <Link
              to="/products"
              className="p-2 text-[#6B6870] hover:text-[#171719] hover:bg-[#F6F1FB] rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Search products"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Admin shortcut if logged in as admin */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin Panel
              </Link>
            )}

            {/* User Account Menu */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/my-orders"
                  className="text-xs font-medium text-[#171719] hover:text-[#834FD4] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8E3EF] hover:border-[#DFCFF4] bg-[#FAF9FD] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#834FD4]" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#6B6870] hover:text-[#E11D48] rounded-full hover:bg-rose-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center text-xs font-semibold text-[#171719] hover:text-[#834FD4] px-3 py-1.5 rounded-full transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Soft Lavender Pill Cart Button */}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDE5F8] hover:bg-[#DFCFF4] text-[#834FD4] text-xs font-bold transition-all shadow-card"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({totalItemsCount})</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#171719] hover:bg-[#F6F1FB] rounded-full transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E3EF] px-5 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#171719]">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#FAF9FD] transition-colors"
            >
              Shop All
            </Link>
            <Link
              to="/products?category=Skincare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#FAF9FD] transition-colors"
            >
              Skincare
            </Link>
            <Link
              to="/products?category=Haircare"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#FAF9FD] transition-colors"
            >
              Haircare
            </Link>
            <Link
              to="/products?category=Makeup"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#FAF9FD] transition-colors"
            >
              Makeup
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#FAF9FD] transition-colors"
            >
              About
            </Link>
          </div>

          <hr className="border-[#E8E3EF]" />

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Portal
            </Link>
          )}

          {user ? (
            <div className="space-y-2 pt-1">
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF9FD] text-xs font-semibold text-[#171719]"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#834FD4]" />
                  <span>My Orders</span>
                </div>
                <span className="text-[11px] text-[#6B6870] font-normal">{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-[#E11D48] text-xs font-semibold flex items-center gap-2 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 rounded-xl border border-[#E8E3EF] bg-white text-[#171719] font-semibold text-xs"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 rounded-xl bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-semibold text-xs transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
