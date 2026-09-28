'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTrendingUp, FiShoppingBag, FiBox, FiUsers, FiAlertTriangle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { adminService } from '@/lib/services';
import { formatPrice, statusColors } from '@/lib/helpers';

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await adminService.getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="page-enter bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdminNav />

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {dashboard ? formatPrice(dashboard.totalRevenue) : '...'}
                </p>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp /> +14.2% this quarter
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                ₹
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {dashboard ? dashboard.totalOrders : '...'}
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">Active across India</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0f4c81] flex items-center justify-center text-xl">
                <FiShoppingBag />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog Products</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {dashboard ? dashboard.totalProducts : '...'}
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">14 Equipment Categories</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                <FiBox />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Accounts</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {dashboard ? dashboard.totalUsers : '...'}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified institutions</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                <FiUsers />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Recent Orders List */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    Recent High-Value Purchases
                  </h3>
                  <p className="text-xs text-gray-500">Live order feed from institutional and lab portals</p>
                </div>
                <Link href="/admin/orders" className="text-xs font-semibold text-[#0f4c81] hover:underline flex items-center gap-1">
                  View All Orders <FiArrowRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Institution / Buyer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {dashboard?.recentOrders?.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-mono font-bold text-[#0f4c81]">{ord.id}</td>
                        <td className="py-3.5 font-medium text-gray-800">{ord.customer}</td>
                        <td className="py-3.5 font-bold text-gray-900">{formatPrice(ord.total)}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${statusColors[ord.status] || 'bg-gray-100'}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-gray-500">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alerts & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-amber-600 font-bold text-sm">
                  <FiAlertTriangle className="text-lg" />
                  <span>Low Inventory Alert ({dashboard?.lowStockProducts?.length || 0})</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  The following precision tools have fallen below reorder point threshold:
                </p>

                <div className="space-y-3">
                  {dashboard?.lowStockProducts?.map((item) => (
                    <div key={item.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <span className="text-[10px] text-gray-500 capitalize">{item.category?.replace(/-/g, ' ')}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-black text-xs shrink-0">
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/admin/products"
                  className="block text-center mt-5 text-xs font-semibold text-[#0f4c81] hover:underline"
                >
                  Manage Stock Quantities →
                </Link>
              </div>

              {/* Quick Management Shortcuts */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-sm">
                <h4 className="font-bold text-sm mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Link
                    href="/admin/products/new"
                    className="block w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-all text-center"
                  >
                    + Add New Equipment
                  </Link>
                  <Link
                    href="/admin/inquiries"
                    className="block w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Review Pending Quotes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
