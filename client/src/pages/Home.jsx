import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, MessageCircle, Truck, HeartHandshake } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
  {
    name: 'Skincare',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80',
    count: 'Serums, Creams, Cleansers'
  },
  {
    name: 'Haircare',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80',
    count: 'Shampoos, Masks, Oils'
  },
  {
    name: 'Makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    count: 'Lipsticks, Foundations'
  },
  {
    name: 'Body Care',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
    count: 'Body Butters, Scrubs'
  },
  {
    name: 'Fragrance',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80',
    count: 'Perfumes, Body Mists'
  },
  {
    name: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    count: 'Sunscreen, Soothing Gels'
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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white pt-12 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Pure Botanical Ingredients & Dermatologist Tested
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                Reveal Your Skin's <br />
                <span className="text-emerald-700 italic">Natural Radiance</span>
              </h1>
              <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover clean, scientifically formulated cosmetics, nourishing botanical serums, and luxury fragrances crafted to elevate your daily self-care ritual.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?category=Skincare"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center"
                >
                  View Skincare
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-xl border border-white">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                  alt="Cosmetics presentation"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                      Summer 2026 Collection
                    </p>
                    <h3 className="text-lg font-serif font-bold">
                      Botanical Oils & Hydrating Serums
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">PayHere Sandbox</h4>
              <p className="text-xs text-slate-500">Secure online payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">WhatsApp Ordering</h4>
              <p className="text-xs text-slate-500">1-click direct cart ordering</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Fast Island-Wide</h4>
              <p className="text-xs text-slate-500">Flat Rs. 500 delivery across Sri Lanka</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">100% Authentic</h4>
              <p className="text-xs text-slate-500">Certified dermatologist approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Curated Lines
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Shop by Beauty Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-900 border border-slate-200 shadow-sm"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-white text-sm font-bold group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-300 line-clamp-1">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Our Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Featured Cosmetics & Care
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Browse All ({featuredProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 rounded-xl animate-pulse"></div>
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

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 rounded-2xl text-white p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-emerald-700/80 text-emerald-200 text-xs font-semibold rounded-full uppercase tracking-wider">
              Exclusive Assessment Showcase
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">
              Effortless Ordering & Flexible Checkout
            </h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Order directly via PayHere Sandbox test cards or send your personalized cart straight to our official WhatsApp order line for personal fulfillment.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="px-5 py-2.5 bg-white text-emerald-900 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
