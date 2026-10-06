import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertCircle, CreditCard, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]';
    case 'Shipped':
      return 'bg-[#E8F1FA] text-[#4476A8] border-[#CCE0F5]';
    case 'Processing':
      return 'bg-[#EDE5F8] text-[#834FD4] border-[#DFCFF4]';
    case 'Confirmed':
      return 'bg-[#FBEFE6] text-[#B86B3E] border-[#F5DAC7]';
    case 'Cancelled':
      return 'bg-[#FCEAEF] text-[#C0496E] border-[#F8C8D5]';
    default:
      return 'bg-[#FAF9FD] text-[#6B6870] border-[#E8E3EF]';
  }
};

const getPaymentBadge = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]';
    case 'Failed':
      return 'bg-[#FCEAEF] text-[#C0496E] border-[#F8C8D5]';
    default:
      return 'bg-[#FBEFE6] text-[#B86B3E] border-[#F5DAC7]';
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/pay`);
      fetchOrders();
    } catch (err) {
      alert('Payment simulation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#9B6DE3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4] block">
          ACCOUNT HISTORY
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171719] mt-1">
          My Order History
        </h1>
        <p className="text-xs text-[#6B6870] mt-1.5">
          Track fulfillment status, courier dispatch, and payment confirmations
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-[#E11D48] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-[#E8E3EF] text-center space-y-5 max-w-lg mx-auto shadow-card">
          <div className="w-16 h-16 bg-[#EDE5F8] text-[#834FD4] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#171719]">
            You haven't placed any orders yet.
          </h3>
          <p className="text-xs text-[#6B6870] leading-relaxed max-w-xs mx-auto">
            When you checkout cosmetics via PayHere or WhatsApp, your order details and live dispatch progress will appear here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft"
          >
            Start Browsing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-[#E8E3EF] shadow-card overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-[#FAF9FD] p-5 sm:p-6 border-b border-[#E8E3EF] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-xs font-semibold text-[#171719]">
                    Placed on {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    Fulfillment: {order.orderStatus}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getPaymentBadge(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="divide-y divide-[#F6F1FB]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FAF9FD] border border-[#E8E3EF] shrink-0"
                        />
                        <div>
                          <p className="text-xs font-serif font-bold text-[#171719] line-clamp-1">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-[#6B6870]">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#171719]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Summary */}
                <div className="pt-4 border-t border-[#F6F1FB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-[#6B6870]">
                    <p>
                      <strong>Payment Method:</strong>{' '}
                      {order.paymentMethod === 'WhatsApp' ? (
                        <span className="inline-flex items-center gap-1 text-[#834FD4] font-semibold">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#171719] font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-[#834FD4]" /> PayHere Online Payment
                        </span>
                      )}
                    </p>
                    <p className="line-clamp-1">
                      <strong>Delivery to:</strong> {order.shippingAddress} ({order.phone})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-[#6B6870] block">Total Amount (incl. Rs. 500 delivery)</span>
                      <span className="text-base font-bold text-[#171719]">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {order.paymentStatus === 'Pending' && order.paymentMethod === 'PayHere' && (
                      <button
                        onClick={() => handlePayOrder(order._id)}
                        className="px-4 py-2 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white text-xs font-bold shadow-soft transition-colors"
                      >
                        Complete PayHere
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
