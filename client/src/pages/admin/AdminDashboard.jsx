import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../services/api';
import { formatPrice, formatDate, formatOrderId, getOrderStatusBadge, getPaymentStatusBadge } from '../../utils/formatters';

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
    <div className="min-h-screen bg-[#FAF9FD]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4] block">
            ADMIN OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171719] mt-1">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-[#6B6870] mt-1">
            Real-time analytics for Lumina Cosmetics catalog, inventory, and orders
          </p>
        </div>

        {loading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-[#E8E3EF]"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Metric Cards (16px/20px border radius) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#6B6870] uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <p className="text-2xl font-bold text-[#171719] mt-1">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                  <span className="text-[11px] text-[#50805C] font-semibold">From completed orders</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EDE5F8] text-[#834FD4] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#6B6870] uppercase tracking-wider">
                    Total Orders
                  </span>
                  <p className="text-2xl font-bold text-[#171719] mt-1">
                    {stats.totalOrders}
                  </p>
                  <span className="text-[11px] text-[#6B6870] font-medium">All checkout channels</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F1FA] text-[#4476A8] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#6B6870] uppercase tracking-wider">
                    Pending Orders
                  </span>
                  <p className="text-2xl font-bold text-[#B86B3E] mt-1">
                    {stats.pendingOrders}
                  </p>
                  <span className="text-[11px] text-[#B86B3E] font-semibold">Requires dispatch action</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FBEFE6] text-[#B86B3E] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E3EF] shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#6B6870] uppercase tracking-wider">
                    Products
                  </span>
                  <p className="text-2xl font-bold text-[#171719] mt-1">
                    {stats.totalProducts}
                  </p>
                  <span className="text-[11px] text-[#6B6870] font-medium">Active & archived</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3EC] text-[#50805C] flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl border border-[#E8E3EF] shadow-card overflow-hidden">
              <div className="p-6 border-b border-[#F6F1FB] flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-[#171719] text-base">Recent Transactions</h3>
                  <p className="text-xs text-[#6B6870]">Latest orders received from customer storefront</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-semibold text-[#834FD4] hover:text-[#6C39B7] flex items-center gap-1.5"
                >
                  Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9FD] text-[#6B6870] uppercase font-semibold border-b border-[#E8E3EF]">
                    <tr>
                      <th className="px-6 py-3.5">Order ID</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Payment</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Total</th>
                      <th className="px-6 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F6F1FB]">
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#FAF9FD]/70 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-xs text-[#834FD4]">
                            {formatOrderId(order._id)}
                          </td>
                          <td className="px-6 py-4 text-[#171719] font-medium">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs text-[#171719] font-medium">{order.paymentMethod}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getPaymentStatusBadge(order.paymentStatus)}`}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${getOrderStatusBadge(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#171719]">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-6 py-4 text-[#6B6870]">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-[#6B6870]">
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
