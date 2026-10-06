import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-700">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore our range of botanical skincare, cosmetics, and beauty essentials to find your favorites.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected beauty items before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {item.brand}
                  </span>
                  <Link
                    to={`/products/${item.product}`}
                    className="block text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Price: {formatPrice(item.price)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Max Stock: {item.stock}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-slate-900 bg-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 text-sm font-bold"
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-bold text-slate-900 block">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Island-wide Delivery</span>
              <span className="font-semibold text-slate-900">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-emerald-800 text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <p>✓ Support for PayHere Sandbox Online Gateway</p>
            <p>✓ Instant WhatsApp Checkout available</p>
            <p>✓ 100% Genuine, verified cosmetics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
