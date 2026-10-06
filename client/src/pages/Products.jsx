import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const categories = [
  'All',
  'Skincare',
  'Haircare',
  'Makeup',
  'Body Care',
  'Fragrance',
  'Personal Care'
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (currentCategory && currentCategory !== 'All') {
        queryParams.append('category', currentCategory);
      }
      if (currentSearch) {
        queryParams.append('search', currentSearch);
      }
      if (currentSort) {
        queryParams.append('sort', currentSort);
      }

      const { data } = await api.get(`/products?${queryParams.toString()}`);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleCategorySelect = (category) => {
    updateParam('category', category);
  };

  const handleSortChange = (e) => {
    updateParam('sort', e.target.value);
  };

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E3EF] pb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4]">
            SHOP ALL
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171719] mt-1">
            Discover Your Everyday Essentials
          </h1>
          <p className="text-sm text-[#6B6870] mt-2 max-w-lg">
            Gentle botanical formulas, concentrated active serums, and luxury cosmetics formulated for healthy radiant skin.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Search products or brands..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-[#E8E3EF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] focus:border-transparent transition-all shadow-card placeholder-[#6B6870]"
          />
          <Search className="w-4 h-4 text-[#6B6870] absolute left-4 top-3.5" />
        </form>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Horizontally Scrollable Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                currentCategory === cat
                  ? 'bg-[#9B6DE3] text-white shadow-soft'
                  : 'bg-white text-[#171719] border border-[#E8E3EF] hover:border-[#DFCFF4] hover:bg-[#FAF9FD]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Counter and Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-xs text-[#6B6870]">
            Showing <strong className="text-[#171719] font-bold">{products.length}</strong> items
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B6870]" />
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="text-xs bg-white border border-[#E8E3EF] rounded-full px-4 py-2 text-[#171719] font-medium focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] shadow-card cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-3xl border border-[#E8E3EF] animate-pulse"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E3EF] max-w-lg mx-auto p-10 space-y-4 shadow-card">
          <div className="w-14 h-14 bg-[#EDE5F8] text-[#834FD4] rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#171719]">
            No beauty essentials found
          </h3>
          <p className="text-xs text-[#6B6870] leading-relaxed max-w-xs mx-auto">
            We couldn't find any cosmetics matching your current search or category filter. Try clearing filters to see the full collection.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-full bg-[#9B6DE3] text-white hover:bg-[#834FD4] transition-colors shadow-soft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
