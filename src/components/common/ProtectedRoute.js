'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/store';

/**
 * ProtectedRoute — wraps pages that require authentication.
 * @param {boolean} adminOnly - If true, only admin users can access.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (adminOnly && user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, loading, adminOnly, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0f4c81] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== 'admin') return null;

  return children;
}
