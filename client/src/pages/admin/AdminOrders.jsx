import React, { useEffect, useState } from 'react';
import { Eye, Search, MessageCircle, CreditCard, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../services/api';
import { formatPrice, formatDate, formatOrderId, getPaymentStatusBadge } from '../../utils/formatters';

const orderStatusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatusOptions = ['Pending', 'Paid', 'Failed'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    try {
      const payload = {};
      if (newOrderStatus) payload.orderStatus = newOrderStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      await api.put(`/admin/orders/${orderId}/status`, payload);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          ...(newOrderStatus ? { orderStatus: newOrderStatus } : {}),
          ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {})
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.orderStatus === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAF9FD]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4] block">
              DISPATCH & FULFILLMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171719] mt-1">
              Customer Order Management
            </h1>
            <p className="text-xs text-[#6B6870] mt-1">
              Process customer shipments, verify payment statuses, and fulfill cosmetics orders
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#6B6870]">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E8E3EF] rounded-full px-4 py-2 font-medium text-[#171719] focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] shadow-card cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {orderStatusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-[#E8E3EF] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FD] text-[#6B6870] uppercase font-semibold border-b border-[#E8E3EF]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Payment State</th>
                  <th className="px-6 py-4">Fulfillment Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F1FB]">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-[#6B6870]">
                      Loading customer orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#FAF9FD]/60 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-[#834FD4]">
                        {formatOrderId(order._id)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#171719]">{order.customerName}</div>
                        <div className="text-[11px] text-[#6B6870]">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-[#171719]">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 font-bold text-[#171719]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#171719]">
                          {order.paymentMethod === 'WhatsApp' ? (
                            <MessageCircle className="w-3.5 h-3.5 text-[#834FD4]" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-[#834FD4]" />
                          )}
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, null, e.target.value)
                          }
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-[#EBF3EC] text-[#50805C] border-[#D1E6D4]'
                              : 'bg-[#FBEFE6] text-[#B86B3E] border-[#F5DAC7]'
                          }`}
                        >
                          {paymentStatusOptions.map((ps) => (
                            <option key={ps} value={ps}>
                              {ps}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value, null)
                          }
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#FAF9FD] border border-[#E8E3EF] text-[#171719] focus:outline-none focus:ring-1 focus:ring-[#9B6DE3] cursor-pointer"
                        >
                          {orderStatusOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-[#6B6870] hover:text-[#834FD4] hover:bg-[#EDE5F8] rounded-xl transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-[#6B6870]">
                      No orders matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-5 shadow-soft border border-[#E8E3EF] max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#F6F1FB] pb-4">
              <div>
                <h3 className="font-serif font-bold text-[#171719] text-base">
                  Order Details: {formatOrderId(selectedOrder._id)}
                </h3>
                <span className="text-[#6B6870] text-[11px]">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#6B6870] hover:text-[#171719] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FAF9FD] p-4 rounded-2xl space-y-2 border border-[#E8E3EF]">
              <p>
                <strong className="text-[#171719]">Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong className="text-[#171719]">Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong className="text-[#171719]">Delivery Address:</strong> {selectedOrder.shippingAddress}
              </p>
              <p className="flex items-center gap-2">
                <strong className="text-[#171719]">Payment:</strong> {selectedOrder.paymentMethod} •{' '}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-[#171719] mb-2.5">Purchased Cosmetics:</h4>
              <div className="divide-y divide-[#F6F1FB] border border-[#E8E3EF] rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-[#171719]">{item.name}</p>
                      <p className="text-[#6B6870] text-[11px]">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#171719]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F6F1FB] pt-3 flex justify-between font-bold text-sm text-[#171719]">
              <span>Total (incl. Rs. 500 delivery)</span>
              <span className="text-[#834FD4]">{formatPrice(selectedOrder.total)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#171719] text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
