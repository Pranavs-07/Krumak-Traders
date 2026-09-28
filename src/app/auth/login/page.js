'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiMail, FiArrowRight, FiInfo } from 'react-icons/fi';
import { useAuthStore } from '@/context/store';
import { authService } from '@/lib/services';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login(formData);
      if (res.user && res.token) {
        login(res.user, res.token);
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/auth/profile');
        }
      } else {
        toast.error(res.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@krumak.com', password: 'admin123' });
    } else {
      setFormData({ email: 'customer@laboratory.org', password: 'password123' });
    }
  };

  return (
    <div className="page-enter bg-gray-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f4c81] to-[#00b894] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-md">
            K
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign In to Your Account
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Access orders, quotes, and laboratory account details
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3.5 mb-6 text-xs text-blue-900">
          <div className="font-semibold flex items-center gap-1.5 mb-1 text-[#0f4c81]">
            <FiInfo /> Quick Fill Demo Credentials:
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="px-2.5 py-1 bg-white rounded-lg border border-blue-200 font-medium text-[11px] hover:bg-blue-50 transition-colors"
            >
              Fill Customer Login
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 bg-[#0f4c81] text-white rounded-lg font-medium text-[11px] hover:bg-[#0a3460] transition-colors"
            >
              Fill Admin Login
            </button>
          </div>
        </div>

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
                value={formData.email}
                onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                placeholder="you@lab.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-[#0f4c81] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center !py-3.5 text-sm mt-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <FiArrowRight />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/register" className="text-[#0f4c81] font-bold hover:underline">
            Register your institution
          </Link>
        </p>
      </div>
    </div>
  );
}
