import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = '94771234567';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-serif">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">LUMINA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium cosmetics, botanical skincare, and luxury beauty essentials crafted to nourish, revitalize, and highlight your natural radiance.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Lumina Cosmetics, I have an inquiry regarding your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                Chat with Beauty Advisor
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=Skincare" className="hover:text-emerald-400 transition-colors">
                  Botanical Skincare
                </Link>
              </li>
              <li>
                <Link to="/products?category=Haircare" className="hover:text-emerald-400 transition-colors">
                  Haircare & Serums
                </Link>
              </li>
              <li>
                <Link to="/products?category=Makeup" className="hover:text-emerald-400 transition-colors">
                  Luxury Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=Body Care" className="hover:text-emerald-400 transition-colors">
                  Body Care & Scrubs
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fragrance" className="hover:text-emerald-400 transition-colors">
                  Signature Fragrance
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/my-orders" className="hover:text-emerald-400 transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li className="text-slate-400">
                Island-wide Delivery in 2-3 Business Days
              </li>
              <li className="text-slate-400">
                Secure Sandbox Payments via PayHere
              </li>
              <li className="text-slate-400">
                Direct WhatsApp Ordering Available
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Store Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No. 124, Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>hello@luminacosmetics.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Lumina Cosmetics Store. Technical Assessment Submission.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded text-slate-400">
              PayHere Sandbox Certified
            </span>
            <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded text-slate-400">
              WhatsApp Integrated
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
