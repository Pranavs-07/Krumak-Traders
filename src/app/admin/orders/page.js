'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { adminService } from '@/lib/services';
import { formatPrice, statusColors } from '@/lib/helpers';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order ${orderId} marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="page-enter bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdminNav />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                Order Fulfillment Management
              </h1>
              <p className="text-xs text-gray-500">Track purchase transactions, update shipping lifecycles, and monitor invoice totals</p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="border border-gray-200/70 rounded-2xl p-5 hover:border-gray-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order Reference</span>
                      <span className="font-mono font-bold text-sm text-[#0f4c81]">{ord.id}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer / Lab</span>
                      <span className="text-xs font-semibold text-gray-900">{ord.customer?.name}</span>
                      <span className="text-[11px] text-gray-400 block">{ord.customer?.email}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order Value</span>
                      <span className="text-sm font-black text-gray-900">{formatPrice(ord.total)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status Lifecycle</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border uppercase tracking-wider outline-none cursor-pointer ${
                          statusColors[ord.status] || 'bg-gray-100'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="pt-3">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Ordered Equipment:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ord.items?.map((it, i) => (
                        <span key={i} className="text-xs bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-gray-700">
                          {it.name} (Qty: {it.quantity || 1}) — {formatPrice(it.price)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
