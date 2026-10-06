import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, Sparkles, AlertCircle } from 'lucide-react';
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
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Item Unavailable</h2>
        <p className="text-sm text-slate-600 mb-6">{error || 'Could not locate this product.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        {/* Product Image Section */}
        <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {product.brand}
              </span>
              {isOutOfStock ? (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Out of Stock
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  In Stock ({product.stock} units left)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="border-y border-slate-100 py-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-slate-500">Including taxes</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Description & Highlights
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart Form */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 disabled:opacity-50 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 disabled:opacity-50 text-sm font-bold"
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
                className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Currently Out of Stock' : 'Add to Shopping Cart'}
              </button>

              <Link
                to="/cart"
                className="py-3.5 px-6 rounded-xl text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-center"
              >
                View Cart
              </Link>
            </div>

            {/* Added Feedback Toast */}
            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Added {quantity} unit(s) of {product.name} to your cart!
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PayHere Sandbox Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Island-wide Delivery Rs. 500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
