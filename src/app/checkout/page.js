'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiAlertCircle, FiLock, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import { useCartStore } from '@/context/store';
import { orderService } from '@/lib/services';
import { formatPrice, generateOrderId } from '@/lib/helpers';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 500;
  const total = subtotal + tax + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    paymentMethod: 'card', // 'card' | 'upi' | 'netbanking' | 'po'
    sameAsShipping: true,
  });

  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'failure' | null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSimulatePayment = async (status) => {
    if (!formData.firstName || !formData.email || !formData.address || !formData.phone) {
      toast.error('Please fill in all mandatory shipping details.');
      return;
    }

    setProcessing(true);
    setPaymentStatus(null);

    // Simulate API delay / gateway interaction
    setTimeout(async () => {
      setProcessing(false);
      if (status === 'failure') {
        setPaymentStatus('failure');
        toast.error('Payment simulation failed! Please retry or choose another method.');
      } else {
        setPaymentStatus('success');
        const orderId = generateOrderId();
        
        // Call backend API order service
        try {
          await orderService.createOrder({
            orderId,
            items,
            customer: {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
            },
            shippingAddress: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              country: formData.country,
            },
            payment: {
              method: formData.paymentMethod,
              status: 'paid',
              amount: total,
            },
            total,
          });

          // Store temporary confirmation details
          sessionStorage.setItem('last_order', JSON.stringify({
            orderId,
            total,
            date: new Date().toLocaleDateString(),
            items,
            customer: formData,
          }));

          clearCart();
          toast.success('Payment authorized & order confirmed!');
          router.push(`/checkout/confirmation?orderId=${orderId}`);
        } catch (err) {
          toast.error('Error placing order on server');
        }
      }
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add laboratory equipment to your cart before proceeding to checkout.</p>
        <Link href="/products/all" className="btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="page-enter bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="flex items-center gap-1.5 text-sm text-[#0f4c81] font-semibold hover:underline">
            <FiArrowLeft /> Back to Cart
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Secure Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Form: Shipping & Billing */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-sm">1</span>
                Shipping & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Dr. / Mr. Rajesh"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Kumar"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="lab.director@institute.org"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Institution / Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="IIT Delhi / Pharma Lab"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Delivery Address / Laboratory *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Department of Chemistry, Block 4, Tech Park Road"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">PIN / Postal Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="110016"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Country</label>
                  <input
                    type="text"
                    disabled
                    value={formData.country}
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section (Mock Gateway) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-sm">2</span>
                Payment Processing Simulation
              </h2>
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
                <FiLock className="text-emerald-600" />
                256-bit SSL encrypted. Pluggable architecture ready for Razorpay/Stripe webhooks.
              </p>

              {/* Payment selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'upi', label: 'UPI / QR' },
                  { id: 'netbanking', label: 'Net Banking' },
                  { id: 'po', label: 'Institutional PO' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, paymentMethod: m.id }))}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                      formData.paymentMethod === m.id
                        ? 'border-[#0f4c81] bg-blue-50/70 text-[#0f4c81] shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Dummy Gateway Sandbox Box */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-2xl text-white mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Mock Payment Gateway Gateway v1.0
                  </span>
                  <FiCreditCard className="text-2xl text-white/70" />
                </div>
                <p className="text-sm text-gray-300 mb-5">
                  Simulating payment checkout for <span className="font-bold text-white">{formatPrice(total)}</span>. Select an action below to test both success & failure scenarios:
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleSimulatePayment('success')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {processing ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <FiCheckCircle />
                        Simulate Payment Success
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleSimulatePayment('failure')}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <FiAlertCircle />
                    Simulate Payment Failure
                  </button>
                </div>
              </div>

              {paymentStatus === 'failure' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
                  <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Transaction Declined by Gateway</strong>
                    The simulated transaction was rejected. You can retry with the success button above or change details.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Order Summary ({items.length} items)
              </h2>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 mb-6">
                {items.map(item => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                      🔬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18% Lab Equipment Tax)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insured Freight / Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {shipping === 0 ? 'FREE (Orders > ₹50,000)' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-xl text-[#0f4c81]">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                Institutional buyers requiring an official proforma invoice or purchase order acknowledgment can also choose the quote option on any product page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
