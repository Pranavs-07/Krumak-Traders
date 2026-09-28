'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiUser, FiPackage, FiFileText, FiEdit3, FiSave, FiLogOut, FiCheck, FiClock, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useAuthStore } from '@/context/store';
import { authService, orderService, inquiryService } from '@/lib/services';
import { formatPrice, statusColors } from '@/lib/helpers';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inquiries' | 'settings'

  // Editable profile state
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Dr. Rajesh Kumar',
    email: user?.email || 'rajesh.kumar@iitd.ac.in',
    phone: user?.phone || '+91 98765 43210',
    company: user?.company || 'Indian Institute of Technology Delhi',
    department: 'Department of Chemistry',
    address: 'IIT Campus, Hauz Khas, New Delhi, 110016',
  });

  // Mock / Fetched Orders & Inquiries
  const [orders, setOrders] = useState([
    {
      id: 'KRM-78921-X',
      date: '2024-03-18',
      total: 245000,
      status: 'confirmed',
      items: [
        { name: 'HPLC System - Analytical Grade', qty: 1, price: 245000 }
      ]
    },
    {
      id: 'KRM-45120-B',
      date: '2024-02-10',
      total: 14400,
      status: 'delivered',
      items: [
        { name: 'Borosilicate Beaker Set (6 pcs)', qty: 6, price: 2400 }
      ]
    }
  ]);

  const [inquiries, setInquiries] = useState([
    {
      id: 'INQ-99021',
      date: '2024-03-12',
      productInterest: 'Refrigerated Centrifuge + Rotors',
      quantity: '2 units',
      status: 'resolved',
      response: 'Official quotation sent to email on March 13. Discount applied for academic institution.'
    },
    {
      id: 'INQ-99055',
      date: '2024-03-22',
      productInterest: 'UV-Vis Spectrophotometer',
      quantity: '1 unit',
      status: 'open',
      response: 'Under evaluation by our instrumentation team.'
    }
  ]);

  useEffect(() => {
    if (user?.name) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profileForm);
      updateUser({ ...user, ...profileForm });
      setEditMode(false);
      toast.success('Profile credentials updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <ProtectedRoute>
      <div className="page-enter bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* User Banner Header */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0f4c81] to-[#00b894] text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg">
                {profileForm.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    {profileForm.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                    Verified Customer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{profileForm.company}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiMail className="text-gray-400" /> {profileForm.email}</span>
                  <span className="flex items-center gap-1"><FiPhone className="text-gray-400" /> {profileForm.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-secondary !py-2.5 !px-5 text-xs flex-1 md:flex-none justify-center"
              >
                <FiEdit3 /> {editMode ? 'Cancel Editing' : 'Edit Profile'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                  activeTab === 'orders'
                    ? 'bg-[#0f4c81] text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FiPackage /> Order History
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                  activeTab === 'inquiries'
                    ? 'bg-[#0f4c81] text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FiFileText /> Saved Quotes / Inquiries
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'inquiries' ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {inquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                  activeTab === 'settings'
                    ? 'bg-[#0f4c81] text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FiUser /> Account & Lab Details
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Dispatched & In-Transit Orders
                  </h2>

                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                        <div>
                          <span className="text-xs text-gray-400 block mb-0.5">Order Reference</span>
                          <span className="font-mono font-bold text-[#0f4c81] text-sm">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block mb-0.5">Order Placed</span>
                          <span className="text-xs font-semibold text-gray-700">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block mb-0.5">Payment Total</span>
                          <span className="text-sm font-extrabold text-gray-900">{formatPrice(order.total)}</span>
                        </div>
                        <div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 divide-y divide-gray-50">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#00b894]"></span>
                              {item.name} × {item.qty}
                            </span>
                            <span className="font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end gap-3">
                        <Link href="/contact" className="text-xs text-gray-500 hover:text-[#0f4c81] font-semibold">
                          Need technical calibration certificate?
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                      Submitted Quotation Inquiries
                    </h2>
                    <Link href="/quote" className="btn-primary !py-2 !px-4 text-xs">
                      + New Quote Request
                    </Link>
                  </div>

                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-xs text-gray-400 block mb-0.5">Inquiry Code</span>
                          <span className="font-mono font-bold text-gray-900 text-sm">{inq.id}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400 block mb-0.5">Logged Date</span>
                          <span className="text-xs font-semibold text-gray-700">{inq.date}</span>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[inq.status] || 'bg-gray-100'}`}>
                          {inq.status}
                        </span>
                      </div>

                      <div className="py-3 text-sm">
                        <p className="font-semibold text-gray-900 mb-1">
                          Product Requested: <span className="text-[#0f4c81]">{inq.productInterest}</span> ({inq.quantity})
                        </p>
                        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100/70 mt-2 text-xs text-blue-900">
                          <strong className="block font-semibold mb-0.5">Krumak Desk Response:</strong>
                          {inq.response}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: SETTINGS / PROFILE FORM */}
              {(activeTab === 'settings' || editMode) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    Institutional Profile Information
                  </h2>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Officer Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(f => ({ ...f, email: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Institution / Organization</label>
                        <input
                          type="text"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm(f => ({ ...f, company: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={profileForm.department}
                          onChange={(e) => setProfileForm(f => ({ ...f, department: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Default Lab Delivery Address</label>
                        <textarea
                          rows={3}
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(f => ({ ...f, address: e.target.value }))}
                          className="input-field resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button type="submit" className="btn-primary !py-2.5 !px-6 text-sm">
                        <FiSave /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
