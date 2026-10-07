import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = '94771129911';

  return (
    <footer className="bg-[#171719] text-[#FAF9FD] pt-16 pb-12 border-t border-[#2A2930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="Lumina Cosmetics & Beauty" 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#443859]" 
              />
              <span className="text-xl font-extrabold text-white tracking-wide">LUMINA</span>
            </div>
            <p className="text-xs text-[#9B98A0] leading-relaxed max-w-xs">
              Clean botanical cosmetics and luxury beauty essentials formulated to nourish, protect, and highlight your everyday radiance.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Lumina Cosmetics, I have an inquiry regarding your products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#B58EED] bg-[#2A2536] border border-[#443859] px-4 py-2 rounded-full hover:bg-[#342B45] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#B58EED]" />
                Beauty Advisor Live Chat
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.15em] uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9B98A0]">
              <li>
                <Link to="/products?category=Skincare" className="hover:text-white transition-colors">
                  Botanical Skincare
                </Link>
              </li>
              <li>
                <Link to="/products?category=Haircare" className="hover:text-white transition-colors">
                  Haircare & Serums
                </Link>
              </li>
              <li>
                <Link to="/products?category=Makeup" className="hover:text-white transition-colors">
                  Velvet Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=Body Care" className="hover:text-white transition-colors">
                  Body Care & Scrubs
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fragrance" className="hover:text-white transition-colors">
                  Signature Fragrance
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.15em] uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9B98A0]">
              <li>
                <Link to="/my-orders" className="hover:text-white transition-colors">
                  Track Past Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                Island-wide Courier (Flat Rs. 500)
              </li>
              <li>
                PayHere Secure Payment Gateway
              </li>
              <li>
                Instant WhatsApp Ordering
              </li>
            </ul>
          </div>

          {/* Boutique Contact */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-[0.15em] uppercase mb-4">
              Boutique Location
            </h4>
            <div className="space-y-3 text-xs text-[#9B98A0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B58EED] shrink-0 mt-0.5" />
                <span>No. 124, Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B58EED] shrink-0" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B58EED] shrink-0" />
                <span>hello@luminacosmetics.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2930] text-center text-xs text-[#6B6870] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Lumina Cosmetics & Beauty Store. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-[#232228] px-3 py-1 rounded-full text-[#B58EED] border border-[#373440]">
              PayHere Secure Certified
            </span>
            <span className="text-[11px] bg-[#232228] px-3 py-1 rounded-full text-[#B58EED] border border-[#373440]">
              WhatsApp Live Orders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
