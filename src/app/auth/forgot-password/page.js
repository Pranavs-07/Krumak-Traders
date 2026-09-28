'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { authService } from '@/lib/services';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset instructions sent');
    } catch (err) {
      toast.error('Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter bg-gray-50 min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0f4c81] mb-6">
          <FiArrowLeft /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <FiCheckCircle />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Inbox</h2>
            <p className="text-gray-600 text-sm mb-6">
              We have dispatched password recovery instructions to <strong className="text-gray-900">{email}</strong>.
            </p>
            <Link href="/auth/login" className="btn-primary w-full justify-center !py-3 text-sm">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Reset Password
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Enter the official email associated with your KRUMAK TRADERS account to receive reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="account@institute.edu"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center !py-3.5 text-sm disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
