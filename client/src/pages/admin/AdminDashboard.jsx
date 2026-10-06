import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, DollarSign, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time overview of cosmetics inventory, order processing, and revenue
          </p>
        </div>

        {loading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-medium">From verified orders</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.totalOrders}
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">All channels</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pending Orders
                  </span>
                  <p className="text-2xl font-bold text-amber-700 mt-1">
                    {stats.pendingOrders}
                  </p>
                  <span className="text-[11px] text-amber-600 font-medium">Requires action</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Products in Catalog
                  </span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.totalProducts}
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">Active & Inactive</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Recent Orders</h3>
                  <p className="text-xs text-slate-400">Latest orders placed by customers</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                            {order._id.slice(-6)}
                          </td>
                          <td className="px-5 py-3.5 text-slate-800 font-medium">
                            {order.customerName}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-700">
                              {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-5 py-8 text-center text-slate-400">
                          No recent orders.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
