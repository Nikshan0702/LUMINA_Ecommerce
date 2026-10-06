import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertCircle, CreditCard, MessageCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Processing':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Confirmed':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getPaymentBadge = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Failed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
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
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track fulfillment status, payment confirmation, and delivery updates
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            When you purchase items via PayHere or WhatsApp, your order details and delivery status will appear here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow-sm"
          >
            Start Browsing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-slate-50/80 p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Order Reference:</span>{' '}
                  <span className="font-mono font-bold text-slate-800">{order._id}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Placed on {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Order Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    Status: {order.orderStatus}
                  </span>

                  {/* Payment Status Badge */}
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
              <div className="p-4 sm:p-5 space-y-4">
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Summary */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-slate-500">
                    <p>
                      <strong>Payment Method:</strong>{' '}
                      {order.paymentMethod === 'WhatsApp' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Order
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-800 font-semibold">
                          <CreditCard className="w-3.5 h-3.5" /> PayHere Sandbox
                        </span>
                      )}
                    </p>
                    <p className="line-clamp-1">
                      <strong>Delivery to:</strong> {order.shippingAddress} ({order.phone})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Total Amount (incl. Rs. 500 delivery)</span>
                      <span className="text-base font-bold text-slate-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {order.paymentStatus === 'Pending' && order.paymentMethod === 'PayHere' && (
                      <button
                        onClick={() => handlePayOrder(order._id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
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
