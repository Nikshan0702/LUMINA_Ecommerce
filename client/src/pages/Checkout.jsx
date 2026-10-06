import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, CreditCard, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

const WHATSAPP_STORE_NUMBER = '94771129911';

const Checkout = () => {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Colombo'
  });

  const [paymentOption, setPaymentOption] = useState('PayHere'); // 'PayHere' or 'WhatsApp'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [payhereModalData, setPayhereModalData] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#171719]">Your bag is empty</h2>
        <p className="text-xs text-[#6B6870]">Add products to your shopping bag before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all shipping details before placing your order.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customerName: formData.name,
        phone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}`,
        paymentMethod: paymentOption
      };

      const { data: createdOrder } = await api.post('/orders', orderPayload);

      if (paymentOption === 'WhatsApp') {
        let orderItemsText = '';
        cart.forEach((item, index) => {
          orderItemsText += `${index + 1}. ${item.name} - ${item.quantity} x Rs. ${item.price}\n`;
        });

        const whatsappMessage = 
`Hello, I would like to place an order.

Customer:
Name: ${formData.name}
Phone: ${formData.phone}

Order:
${orderItemsText}
Subtotal: Rs. ${subtotal}
Delivery: Rs. ${deliveryFee}
Total: Rs. ${total}

Address:
${formData.address}, ${formData.city}

Order ID: ${createdOrder._id}`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_STORE_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
        
        clearCart();
        window.open(whatsappUrl, '_blank');
        navigate('/my-orders');
      } else {
        const { data: payParams } = await api.get(`/orders/${createdOrder._id}/payhere-params`);
        setPayhereModalData({
          order: createdOrder,
          params: payParams
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please check item stock.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayHereComplete = async () => {
    if (!payhereModalData) return;
    try {
      setSubmitting(true);
      await api.post(`/orders/${payhereModalData.order._id}/pay`);
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError('Payment status update failed');
    } finally {
      setSubmitting(false);
      setPayhereModalData(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6870] hover:text-[#171719] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Bag
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4] block">
          SECURE CHECKOUT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171719] mt-1">
          Shipping & Payment
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-[#E11D48] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping & Payment Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Details Box */}
          <div className="bg-white p-7 rounded-3xl border border-[#E8E3EF] shadow-card space-y-5">
            <h2 className="text-base font-serif font-bold text-[#171719] border-b border-[#F6F1FB] pb-3">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#171719] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Nimasha Perera"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171719] mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0771234567"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#171719] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#171719] mb-1.5">
                  Street Address / Apartment *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="No. 45, Flower Road"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171719] mb-1.5">
                  City / District *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Colombo"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-7 rounded-3xl border border-[#E8E3EF] shadow-card space-y-5">
            <h2 className="text-base font-serif font-bold text-[#171719] border-b border-[#F6F1FB] pb-3">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PayHere Radio */}
              <label
                onClick={() => setPaymentOption('PayHere')}
                className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                  paymentOption === 'PayHere'
                    ? 'border-[#9B6DE3] bg-[#EDE5F8]'
                    : 'border-[#E8E3EF] hover:border-[#DFCFF4] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-[#834FD4]" />
                    <span className="text-sm font-bold text-[#171719]">PayHere Online Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="PayHere"
                    checked={paymentOption === 'PayHere'}
                    onChange={() => setPaymentOption('PayHere')}
                    className="accent-[#9B6DE3]"
                  />
                </div>
                <p className="text-[11px] text-[#6B6870] leading-relaxed">
                  Pay securely with Visa, MasterCard, or online banking via PayHere.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#834FD4] font-semibold bg-white/80 px-2.5 py-1 rounded-full w-fit border border-[#DFCFF4]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instant payment verification
                </div>
              </label>

              {/* WhatsApp Radio */}
              <label
                onClick={() => setPaymentOption('WhatsApp')}
                className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                  paymentOption === 'WhatsApp'
                    ? 'border-[#9B6DE3] bg-[#EDE5F8]'
                    : 'border-[#E8E3EF] hover:border-[#DFCFF4] bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-[#834FD4]" />
                    <span className="text-sm font-bold text-[#171719]">Order via WhatsApp</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="WhatsApp"
                    checked={paymentOption === 'WhatsApp'}
                    onChange={() => setPaymentOption('WhatsApp')}
                    className="accent-[#9B6DE3]"
                  />
                </div>
                <p className="text-[11px] text-[#6B6870] leading-relaxed">
                  Send your complete shopping bag directly to our beauty advisors on WhatsApp.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#834FD4] font-semibold bg-white/80 px-2.5 py-1 rounded-full w-fit border border-[#DFCFF4]">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Direct Retailer Chat
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white p-7 rounded-3xl border border-[#E8E3EF] shadow-card space-y-6 h-fit sticky top-28">
          <h2 className="text-base font-serif font-bold text-[#171719] border-b border-[#F6F1FB] pb-3">
            Bag Items ({cart.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-xl object-cover bg-[#FAF9FD] border border-[#E8E3EF] shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-[#171719] line-clamp-1">{item.name}</span>
                    <span className="text-[#6B6870] text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-[#171719] shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F6F1FB] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#6B6870]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#171719]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B6870]">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#171719]">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-[#F6F1FB] pt-2.5 flex justify-between text-sm font-bold text-[#171719]">
              <span>Total Payable</span>
              <span className="text-[#834FD4] text-lg">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all duration-200 disabled:opacity-50"
          >
            {submitting
              ? 'Processing Order...'
              : paymentOption === 'WhatsApp'
              ? 'Place Order & Open WhatsApp'
              : 'Proceed to PayHere Payment'}
          </button>
        </div>
      </form>

      {/* PayHere Payment Interactive Modal */}
      {payhereModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-soft border border-[#E8E3EF] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F6F1FB] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EDE5F8] flex items-center justify-center text-[#834FD4]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#171719] text-base">PayHere Checkout</h3>
                  <span className="text-[11px] text-[#6B6870]">Lumina Cosmetics Official Store</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPayhereModalData(null)}
                className="w-8 h-8 rounded-full hover:bg-[#FAF9FD] text-[#6B6870] hover:text-[#171719] flex items-center justify-center text-sm font-bold transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Total Amount Focus Banner */}
            <div className="bg-[#FAF9FD] p-5 rounded-2xl border border-[#E8E3EF] text-center space-y-1">
              <span className="text-[11px] font-semibold text-[#6B6870] uppercase tracking-wider">
                Total Payable Amount
              </span>
              <div className="text-3xl font-serif font-bold text-[#171719]">
                {formatPrice(payhereModalData.order.total)}
              </div>
              <p className="text-[11px] text-[#6B6870] pt-0.5">
                Order #{payhereModalData.order._id.slice(-6).toUpperCase()} • {cart.length} item(s)
              </p>
            </div>

            {/* Order & Customer Summary */}
            <div className="bg-[#FAF9FD] p-4 rounded-2xl border border-[#E8E3EF] space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[#6B6870]">
                <span>Customer</span>
                <span className="font-semibold text-[#171719]">{formData.name || 'Valued Customer'}</span>
              </div>
              <div className="flex justify-between items-center text-[#6B6870]">
                <span>Contact</span>
                <span className="font-medium text-[#171719]">{formData.phone}</span>
              </div>
              <div className="flex justify-between items-center text-[#6B6870]">
                <span>Delivery Address</span>
                <span className="font-medium text-[#171719] text-right truncate max-w-[200px]">{formData.address}, {formData.city}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E3EF] flex justify-between items-center text-[#6B6870]">
                <span>Payment Channel</span>
                <span className="font-semibold text-[#834FD4]">PayHere Online Gateway</span>
              </div>
            </div>

            {/* Accepted Methods */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#6B6870] block text-center">Supported Payment Methods</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-2 py-1 text-[10px] font-bold bg-[#FAF9FD] border border-[#E8E3EF] rounded-md text-[#171719]">
                  VISA
                </span>
                <span className="px-2 py-1 text-[10px] font-bold bg-[#FAF9FD] border border-[#E8E3EF] rounded-md text-[#171719]">
                  MasterCard
                </span>
                <span className="px-2 py-1 text-[10px] font-bold bg-[#FAF9FD] border border-[#E8E3EF] rounded-md text-[#171719]">
                  AMEX
                </span>
                <span className="px-2 py-1 text-[10px] font-bold bg-[#EDE5F8] text-[#834FD4] rounded-md">
                  Genie
                </span>
                <span className="px-2 py-1 text-[10px] font-bold bg-[#EDE5F8] text-[#834FD4] rounded-md">
                  FriMi
                </span>
              </div>
            </div>

            {/* End-to-End Encryption Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6870] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#50805C]" />
              <span>256-bit SSL encrypted secure payment</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayhereModalData(null)}
                className="flex-1 py-3 px-5 rounded-full border border-[#E8E3EF] text-xs font-semibold text-[#6B6870] hover:bg-[#FAF9FD] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayHereComplete}
                disabled={submitting}
                className="flex-1 py-3 px-5 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold transition-all shadow-soft flex items-center justify-center gap-2"
              >
                {submitting ? 'Authorizing...' : `Pay ${formatPrice(payhereModalData.order.total)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
