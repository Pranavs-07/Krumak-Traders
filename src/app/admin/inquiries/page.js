'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { adminService } from '@/lib/services';
import { statusColors } from '@/lib/helpers';
import toast from 'react-hot-toast';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllInquiries();
      setInquiries(data.inquiries || []);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      await adminService.updateInquiry(id, { status: newStatus });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      toast.success(`Inquiry marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update inquiry status');
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
                B2B Quote Requests & Inquiries
              </h1>
              <p className="text-xs text-gray-500">Respond to technical RFQs, bulk educational pricing demands, and client customizations</p>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="border border-gray-200/80 rounded-2xl p-5 hover:border-gray-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0f4c81]">{inq.id}</span>
                        <span className="font-bold text-sm text-gray-900">{inq.name}</span>
                        {inq.company && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                            {inq.company}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Email: <a href={`mailto:${inq.email}`} className="text-[#0f4c81] font-semibold hover:underline">{inq.email}</a></span>
                        <span>Phone: <a href={`tel:${inq.phone}`} className="text-gray-700 font-semibold">{inq.phone}</a></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusColors[inq.status] || 'bg-gray-100'
                      }`}>
                        {inq.status}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(inq.id, inq.status)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                          inq.status === 'open'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {inq.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-3">
                    <p className="text-xs font-semibold text-gray-900 mb-1">
                      Requested Instruments: <span className="text-[#0f4c81]">{inq.productInterest}</span> (Qty: {inq.quantity})
                    </p>
                    {inq.message && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed mt-2">
                        &ldquo;{inq.message}&rdquo;
                      </p>
                    )}
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
