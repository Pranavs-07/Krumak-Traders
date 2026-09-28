'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiSend, FiCheckCircle, FiFileText, FiHelpCircle, FiShield, FiPackage, FiPhoneCall } from 'react-icons/fi';
import { inquiryService } from '@/lib/services';
import { categories, companyInfo } from '@/lib/mockData';
import toast from 'react-hot-toast';

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const prefillProductId = searchParams.get('product') || '';
  const prefillProductName = searchParams.get('name') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    department: '',
    productInterest: prefillProductName || (prefillProductId ? `Product ID: ${prefillProductId}` : ''),
    quantity: '1',
    category: '',
    timeline: 'Immediate (within 2 weeks)',
    deliveryCity: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  useEffect(() => {
    if (prefillProductName) {
      setFormData(prev => ({ ...prev, productInterest: prefillProductName }));
    }
  }, [prefillProductName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.productInterest) {
      toast.error('Please complete all mandatory fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await inquiryService.submitInquiry(formData);
      setInquiryId(res.inquiry?.id || `INQ-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
      toast.success('Your quote inquiry has been dispatched to our sales desk.');
    } catch (err) {
      toast.error('Unable to send quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
          <FiCheckCircle />
        </div>
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
          Inquiry Logged
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Quote Request Received
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Thank you, <strong className="text-gray-900">{formData.name}</strong>. Our technical sales engineers are compiling formal specifications, tax breakups, and lead times.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-600 mb-8 max-w-sm mx-auto">
          Reference Reference: <span className="font-bold text-[#0f4c81]">{inquiryId}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                companyName: '',
                department: '',
                productInterest: '',
                quantity: '1',
                category: '',
                timeline: 'Immediate (within 2 weeks)',
                deliveryCity: '',
                message: '',
              });
            }}
            className="btn-secondary !py-3 !px-6 text-sm"
          >
            Submit Another Inquiry
          </button>
          <Link href="/products/all" className="btn-primary !py-3 !px-6 text-sm">
            Continue Browsing Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-blue-50 text-[#0f4c81] text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
          Direct B2B & Institutional Procurement
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Request an Official Quotation
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Whether you need a proforma invoice for institutional funding, bulk pricing for university labs, or custom configuration, our sales team replies within 4 business hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Block */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            1. Contact & Institutional Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Sunita Rao"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="s.rao@university.ac.in"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Institution / Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="National Institute of Technology"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Department / Lab Unit</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Bioengineering / Analytical QC"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Destination (City / State)</label>
              <input
                type="text"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={handleChange}
                placeholder="Bengaluru, Karnataka"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Product Requirements Block */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            2. Equipment Specification & Volume
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product(s) of Interest *</label>
              <input
                type="text"
                name="productInterest"
                required
                value={formData.productInterest}
                onChange={handleChange}
                placeholder="e.g. HPLC System Quaternary, Borosilicate Glassware sets (500ml)"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Equipment Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Units / Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 2 units / 50 sets"
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Procurement Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Immediate (within 2 weeks)">Immediate (within 2 weeks)</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="Next quarter / Grant approval pending">Next quarter / Grant approval pending</option>
                <option value="Information gathering / Budgeting phase">Information gathering / Budgeting phase</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Technical Requirements or Custom Notes</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Mention specific sensitivity thresholds, column requirements, installation site readiness, or GST exemption certificates..."
                className="input-field resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <FiShield className="text-emerald-600 text-sm" />
            We respect NDA and Institutional purchase tender rules.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto !py-3.5 !px-8 text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting Request...
              </>
            ) : (
              <>
                <FiSend /> Submit Quote Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function QuotePage() {
  return (
    <div className="page-enter bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Suspense fallback={<div className="text-center py-20">Loading quote form...</div>}>
          <QuoteFormContent />
        </Suspense>
      </div>
    </div>
  );
}
