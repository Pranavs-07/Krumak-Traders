'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '@/context/store';
import { authService } from '@/lib/services';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register(formData);
      if (res.user && res.token) {
        login(res.user, res.token);
        toast.success('Registration successful! Welcome to KRUMAK TRADERS.');
        router.push('/auth/profile');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f4c81] to-[#00b894] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-md">
            K
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Register New Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Create an institutional or laboratory procurement account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Anand Verma"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="a.verma@domain.org"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Laboratory / University / Company
            </label>
            <div className="relative">
              <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData(f => ({ ...f, institution: e.target.value }))}
                placeholder="Dept of Biotechnology, Research Park"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center !py-3.5 text-sm mt-4 disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : 'Create Lab Account'}
            <FiArrowRight />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already registered?{' '}
          <Link href="/auth/login" className="text-[#0f4c81] font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
