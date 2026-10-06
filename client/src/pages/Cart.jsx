import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-[#EDE5F8] rounded-full flex items-center justify-center mx-auto text-[#834FD4]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[#171719]">
          Your bag is waiting for you.
        </h1>
        <p className="text-xs text-[#6B6870] max-w-sm mx-auto leading-relaxed">
          Discover our pure botanical serums, nourishing moisturizers, and cosmetic essentials to start your bag.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex items-end justify-between border-b border-[#E8E3EF] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4]">
            SHOPPING BAG
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171719] mt-1">
            YOUR BAG
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-[#E11D48] hover:underline flex items-center gap-1.5"
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
              className="bg-white p-5 rounded-3xl border border-[#E8E3EF] shadow-card flex flex-col sm:flex-row items-center gap-6 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-[#FAF9FD] shrink-0 border border-[#E8E3EF]"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#834FD4]">
                    {item.brand}
                  </span>
                  <Link
                    to={`/products/${item.product}`}
                    className="block text-sm font-serif font-bold text-[#171719] hover:text-[#834FD4] transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-[#6B6870] mt-0.5">
                    Price: {formatPrice(item.price)}
                  </p>
                  <span className="text-[10px] text-[#6B6870] bg-[#FAF9FD] px-2 py-0.5 rounded-full border border-[#E8E3EF] mt-1 inline-block">
                    In Stock: {item.stock}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-[#F6F1FB]">
                <div className="flex items-center border border-[#E8E3EF] rounded-full overflow-hidden bg-[#FAF9FD]">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-3 py-1.5 text-[#6B6870] hover:text-[#171719] hover:bg-[#EDE5F8] text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-semibold text-[#171719] bg-white min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-3 py-1.5 text-[#6B6870] hover:text-[#171719] hover:bg-[#EDE5F8] disabled:opacity-40 text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-bold text-[#171719] block">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-[#6B6870] hover:text-[#E11D48] rounded-full hover:bg-rose-50 transition-colors"
                  title="Remove product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#834FD4] hover:text-[#6C39B7] pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-7 rounded-3xl border border-[#E8E3EF] shadow-card space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#171719] border-b border-[#F6F1FB] pb-3">
            Order Summary
          </h2>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between text-[#6B6870]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#171719]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B6870]">
              <span>Island-wide Delivery</span>
              <span className="font-semibold text-[#171719]">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-[#F6F1FB] pt-3.5 flex justify-between text-base font-bold text-[#171719]">
              <span>Total Amount</span>
              <span className="text-[#834FD4] text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 border-t border-[#F6F1FB] text-[11px] text-[#6B6870]">
            <p>✓ Support for PayHere Sandbox Online Gateway</p>
            <p>✓ Instant 1-Click WhatsApp Direct Order</p>
            <p>✓ 100% Genuine, certified cosmetics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
