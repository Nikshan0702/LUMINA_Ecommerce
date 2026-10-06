import React, { useEffect, useState } from 'react';
import { Eye, CheckCircle2, Clock, Truck, XCircle, Search, MessageCircle, CreditCard, ChevronDown } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

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
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Process customer shipments, verify payment statuses, and fulfill cosmetics orders
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer & Phone</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                        {order._id.slice(-6)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.phone}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          {order.paymentMethod === 'WhatsApp' ? (
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <CreditCard className="w-3 h-3 text-slate-700" />
                          )}
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, null, e.target.value)
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {paymentStatusOptions.map((ps) => (
                            <option key={ps} value={ps}>
                              {ps}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value, null)
                          }
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        >
                          {orderStatusOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Order Details: {selectedOrder._id}
                </h3>
                <span className="text-slate-500 text-[11px]">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Delivery Address:</strong> {selectedOrder.shippingAddress}
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">Order Items:</h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-sm text-slate-900">
              <span>Total (incl. delivery)</span>
              <span className="text-emerald-800">{formatPrice(selectedOrder.total)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
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
