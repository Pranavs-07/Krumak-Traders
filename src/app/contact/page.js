'use client';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { companyInfo } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your message has been sent to KRUMAK TRADERS desk.');
    }, 800);
  };

  return (
    <div className="page-enter bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#00b894] block mb-2">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Contact KRUMAK TRADERS
          </h1>
          <p className="text-sm text-gray-600">
            Have questions about instrument specifications, tender participation, or bulk consignments? Our support desks are available Monday through Saturday.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Headquarters & Logistics Desk
              </h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0f4c81] flex items-center justify-center shrink-0 text-lg">
                    <FiMapPin />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Corporate Address</h3>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-lg">
                    <FiPhone />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Direct Helplines</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Primary: <a href={`tel:${companyInfo.phone}`} className="font-semibold text-gray-900 hover:text-[#0f4c81]">{companyInfo.phone}</a>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Technical: <a href={`tel:${companyInfo.altPhone}`} className="font-semibold text-gray-900 hover:text-[#0f4c81]">{companyInfo.altPhone}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 text-lg">
                    <FiMail />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Email Correspondence</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      General: <a href={`mailto:${companyInfo.email}`} className="text-[#0f4c81] font-semibold hover:underline">{companyInfo.email}</a>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Tenders & Sales: <a href={`mailto:${companyInfo.salesEmail}`} className="text-[#0f4c81] font-semibold hover:underline">{companyInfo.salesEmail}</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-lg">
                    <FiClock />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-0.5">Working Hours</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:30 PM IST</p>
                    <p className="text-xs sm:text-sm text-gray-600">Saturday: 9:30 AM - 2:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded interactive Google Map placeholder with visual frame */}
            <div className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm overflow-hidden">
              <div className="w-full h-48 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-gray-500 relative border border-dashed border-gray-200">
                <FiMapPin className="text-3xl text-rose-500 mb-1" />
                <span className="text-xs font-bold text-gray-800">Industrial Area, Phase-II, New Delhi</span>
                <span className="text-[11px] text-gray-400">Warehouse & Technical Calibration Facility</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Send Us an Inquiry / Message
              </h2>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    <FiCheckCircle />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Dispatched!</h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Our technical support representative will review your message and reply via email or phone within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="btn-secondary !py-2.5 !px-6 text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                        placeholder="Dr. / Mr. Rajesh Kumar"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                        placeholder="rajesh@institution.org"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 9876543210"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Inquiry Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
                        placeholder="Bulk glassware query / Warranty support"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Message / Technical Inquiries *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                      placeholder="Please describe your laboratory requirements, instrument models, or service questions..."
                      className="input-field resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary !py-3.5 !px-8 text-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiSend /> {loading ? 'Sending...' : 'Transmit Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
