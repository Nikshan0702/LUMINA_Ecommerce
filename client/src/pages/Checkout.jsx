import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MessageCircle, CreditCard, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatPrice } from '../utils/formatters';

const WHATSAPP_STORE_NUMBER = '94771234567';

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
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
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
      // 1. Prepare backend order payload
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

      // 2. Submit order to server
      const { data: createdOrder } = await api.post('/orders', orderPayload);

      if (paymentOption === 'WhatsApp') {
        // Build the formatted WhatsApp message as specified in assessment
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
        // PayHere Sandbox flow
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

  // Handler for simulating / executing the PayHere Sandbox test payment
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Checkout & Shipping
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping & Payment Options */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Details Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              1. Customer & Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Nimasha Perera"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0771234567"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address / Apartment *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="No. 45, Flower Road"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Colombo"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              2. Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PayHere Radio */}
              <label
                onClick={() => setPaymentOption('PayHere')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentOption === 'PayHere'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-700" />
                    <span className="text-sm font-bold text-slate-900">PayHere Sandbox</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="PayHere"
                    checked={paymentOption === 'PayHere'}
                    onChange={() => setPaymentOption('PayHere')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pay securely with Visa, MasterCard, or online banking via PayHere Sandbox test mode.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-1 rounded w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instant payment verification
                </div>
              </label>

              {/* WhatsApp Radio */}
              <label
                onClick={() => setPaymentOption('WhatsApp')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentOption === 'WhatsApp'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-700" />
                    <span className="text-sm font-bold text-slate-900">Order via WhatsApp</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentOption"
                    value="WhatsApp"
                    checked={paymentOption === 'WhatsApp'}
                    onChange={() => setPaymentOption('WhatsApp')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Generate your order message automatically and send it directly to our WhatsApp store.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-1 rounded w-fit">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Direct Retailer Chat
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit sticky top-24">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Order Items ({cart.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover bg-slate-100 border border-slate-100 shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 line-clamp-1">{item.name}</span>
                    <span className="text-slate-500 text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-800">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-emerald-800 text-base">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {submitting
              ? 'Processing Order...'
              : paymentOption === 'WhatsApp'
              ? 'Place Order & Open WhatsApp'
              : 'Proceed to PayHere Sandbox'}
          </button>
        </div>
      </form>

      {/* PayHere Sandbox Interactive Modal */}
      {payhereModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">PayHere Sandbox Checkout</h3>
                  <p className="text-[10px] text-slate-500">Merchant ID: {payhereModalData.params.merchant_id}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                SANDBOX MODE
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-semibold text-slate-800">{payhereModalData.order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-slate-900">{formatPrice(payhereModalData.order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hash Verified:</span>
                <span className="font-mono text-[10px] text-emerald-700 truncate max-w-[200px]">
                  {payhereModalData.params.hash}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Sandbox Payment Simulation
              </div>
              <p className="text-[11px] text-emerald-800">
                Click below to simulate a successful payment callback in the PayHere sandbox.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPayhereModalData(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePayHereComplete}
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
              >
                {submitting ? 'Confirming...' : 'Simulate Successful Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
