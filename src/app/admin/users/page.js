'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { adminService } from '@/lib/services';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data.users || []);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="page-enter bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdminNav />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                Registered Institutional Accounts
              </h1>
              <p className="text-xs text-gray-500">View customer profile data, transaction frequencies, and roles</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Contact Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Orders Fulfilled</th>
                    <th className="pb-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0f4c81] flex items-center justify-center text-[10px] font-bold">
                          {u.name[0]}
                        </div>
                        {u.name}
                      </td>
                      <td className="py-3.5 text-gray-600">{u.email}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-gray-900">{u.orders} orders</td>
                      <td className="py-3.5 text-gray-400">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
