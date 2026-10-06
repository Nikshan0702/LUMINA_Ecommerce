import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, MessageCircle, Droplets, Leaf, Shield, HeartHandshake, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
  {
    name: 'Skincare',
    subtitle: 'Nourishing serums & balms',
    bgColor: 'bg-[#EDE5F8]',
    textColor: 'text-[#834FD4]',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Haircare',
    subtitle: 'Strengthening & repair masks',
    bgColor: 'bg-[#EBF3EC]',
    textColor: 'text-[#50805C]',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Makeup',
    subtitle: 'Velvet lipsticks & satin tints',
    bgColor: 'bg-[#FCEAEF]',
    textColor: 'text-[#C0496E]',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Body Care',
    subtitle: 'Rich butters & botanical scrubs',
    bgColor: 'bg-[#F9F4EB]',
    textColor: 'text-[#9A7A38]',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Fragrance',
    subtitle: 'Signature floral & wood mists',
    bgColor: 'bg-[#E8F1FA]',
    textColor: 'text-[#4476A8]',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Personal Care',
    subtitle: 'Gentle mineral sunscreens',
    bgColor: 'bg-[#FBEFE6]',
    textColor: 'text-[#B86B3E]',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80'
  }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setFeaturedProducts(data.slice(0, 8));
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Large Editorial Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE5F8] border border-[#DFCFF4] text-[#834FD4] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLEAN. EFFECTIVE. GENTLE.</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold text-[#171719] tracking-tight leading-[1.08]">
                REAL CARE. <br />
                <span className="italic font-normal text-[#834FD4]">NATURAL GLOW.</span> <br />
                EVERYDAY.
              </h1>

              <p className="text-base sm:text-lg text-[#6B6870] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Elevate your everyday ritual with dermatologist-tested botanical formulas crafted for healthy, luminous, and resilient skin.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-semibold text-sm rounded-full shadow-soft transition-all duration-200 flex items-center justify-center gap-2.5 group"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?category=Skincare"
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#FAF9FD] text-[#171719] border border-[#E8E3EF] hover:border-[#DFCFF4] font-semibold text-sm rounded-full transition-all flex items-center justify-center shadow-card"
                >
                  Shop Skincare
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                  />
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Customer"
                  />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[#171719]">200K+</div>
                  <div className="text-xs text-[#6B6870]">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Right Lifestyle Visual with Floating Cards */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-soft border-4 border-white bg-[#EDE5F8]">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                  alt="Skincare editorial visual"
                  className="w-full h-[460px] sm:h-[500px] object-cover object-center"
                />
              </div>

              {/* Floating Card 1: Hydrate (Top Right on desktop) */}
              <div className="mt-3 sm:mt-0 sm:absolute sm:-top-5 sm:-right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDE5F8] text-[#834FD4] flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171719]">Hydrate</h4>
                  <p className="text-[11px] text-[#6B6870]">Deep botanical moisture</p>
                </div>
              </div>

              {/* Floating Card 2: Nourish (Bottom Left on desktop) */}
              <div className="mt-2 sm:mt-0 sm:absolute sm:bottom-12 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EBF3EC] text-[#50805C] flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171719]">Nourish</h4>
                  <p className="text-[11px] text-[#6B6870]">Healthy-looking glow</p>
                </div>
              </div>

              {/* Floating Card 3: Protect (Bottom Right on desktop) */}
              <div className="mt-2 sm:mt-0 sm:absolute sm:-bottom-4 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCEAEF] text-[#C0496E] flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#171719]">Protect</h4>
                  <p className="text-[11px] text-[#6B6870]">Daily skin barrier defense</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Redesigned Trust / Value Bar in Rounded White Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E3EF] shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE5F8] text-[#834FD4] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171719]">Natural Ingredients</h4>
                <p className="text-xs text-[#6B6870] mt-0.5">Cruelty-free pure botanicals</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3EC] text-[#50805C] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171719]">Dermatologist Tested</h4>
                <p className="text-xs text-[#6B6870] mt-0.5">Safe for sensitive skin types</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FCEAEF] text-[#C0496E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171719]">PayHere Secure</h4>
                <p className="text-xs text-[#6B6870] mt-0.5">Verified payment gateway</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1FA] text-[#4476A8] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171719]">WhatsApp Ordering</h4>
                <p className="text-xs text-[#6B6870] mt-0.5">Instant direct chat checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Soft Pastel Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4]">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#171719] mt-1">
              Shop by Beauty Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#834FD4] hover:text-[#6C39B7] flex items-center gap-1.5"
          >
            Explore All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group ${cat.bgColor} p-4 rounded-3xl border border-transparent hover:border-[#DFCFF4] hover:shadow-soft transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/70 mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-sm text-[#171719]">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#6B6870] line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.textColor}`}>
                  Browse
                </span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#171719] shadow-sm group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4]">
              Iconic Formulations
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#171719] mt-1">
              Featured Cosmetics & Care
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#834FD4] hover:text-[#6C39B7] flex items-center gap-1.5"
          >
            View All ({featuredProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-3xl border border-[#E8E3EF] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Promotional Editorial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDE5F8] rounded-3xl p-8 sm:p-14 border border-[#DFCFF4] relative overflow-hidden">
          <div className="max-w-xl space-y-4">
            <span className="px-3.5 py-1 bg-white text-[#834FD4] text-xs font-bold rounded-full uppercase tracking-wider inline-block shadow-sm">
              Modern Beauty Experience
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#171719] leading-tight">
              Designed for effortless, glowing everyday care.
            </h3>
            <p className="text-sm text-[#6B6870] leading-relaxed">
              Experience safe PayHere online card checkout or instant one-click order messaging via WhatsApp. Flat Rs. 500 delivery island-wide.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-7 py-3.5 bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold rounded-full shadow-soft transition-colors"
              >
                Shop Essentials
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
