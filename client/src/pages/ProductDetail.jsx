import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, Star, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#9B6DE3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-10 text-center bg-white rounded-3xl border border-[#E8E3EF] shadow-card">
        <AlertCircle className="w-10 h-10 text-[#E11D48] mx-auto mb-3" />
        <h2 className="text-2xl font-serif font-bold text-[#171719] mb-2">Item Unavailable</h2>
        <p className="text-xs text-[#6B6870] mb-6">{error || 'Could not locate this product.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9B6DE3] text-white text-xs font-semibold hover:bg-[#834FD4] transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const currentInCart = cart.find((item) => item.product === product._id);

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B6870] hover:text-[#171719] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start bg-white p-6 sm:p-12 rounded-3xl border border-[#E8E3EF] shadow-card">
        {/* Product Image Showcase */}
        <div className="relative rounded-3xl overflow-hidden aspect-square bg-[#FAF9FD] border border-[#E8E3EF]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute top-5 left-5">
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#171719] shadow-sm border border-[#E8E3EF]">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4]">
                {product.brand}
              </span>
              {isOutOfStock ? (
                <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-[#E11D48] border border-rose-200">
                  OUT OF STOCK
                </span>
              ) : (
                <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-[#EDE5F8] text-[#834FD4] border border-[#DFCFF4]">
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171719] mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#6B6870] font-medium ml-1">5.0 (48 customer reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-y border-[#F6F1FB] py-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#171719]">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-[#6B6870]">Taxes included • Island-wide delivery Rs. 500</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171719]">
              Formulation & Benefits
            </h3>
            <p className="text-sm text-[#6B6870] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-[#171719]">Quantity:</span>
                <div className="flex items-center border border-[#E8E3EF] rounded-full overflow-hidden bg-[#FAF9FD]">
                  <button
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-[#6B6870] hover:text-[#171719] hover:bg-[#EDE5F8] disabled:opacity-40 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-[#171719] bg-white min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 text-[#6B6870] hover:text-[#171719] hover:bg-[#EDE5F8] disabled:opacity-40 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-8 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#9B6DE3] hover:bg-[#834FD4] text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>

              <Link
                to="/cart"
                className="py-4 px-8 rounded-full text-xs font-bold uppercase tracking-wider border border-[#E8E3EF] bg-white hover:bg-[#FAF9FD] text-[#171719] flex items-center justify-center transition-colors"
              >
                View Bag
              </Link>
            </div>

            {/* Added Feedback Toast */}
            {addedNotice && (
              <div className="p-3.5 bg-[#EDE5F8] border border-[#DFCFF4] rounded-2xl text-[#834FD4] text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-[#834FD4] shrink-0" />
                Added {quantity} unit(s) of {product.name} to your shopping bag!
              </div>
            )}
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-[#F6F1FB] space-y-2.5 text-xs text-[#6B6870]">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#834FD4] shrink-0" />
              <span>PayHere secure online payment gateway</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#834FD4] shrink-0" />
              <span>Island-wide courier delivery in 2-3 business days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[#834FD4] shrink-0" />
              <span>100% authentic, cruelty-free botanical formulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
