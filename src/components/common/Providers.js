'use client';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/context/store';

export default function Providers({ children }) {
  const initAuth = useAuthStore((s) => s.initAuth);
  const initCart = useCartStore((s) => s.initCart);

  useEffect(() => {
    initAuth();
    initCart();
  }, [initAuth, initCart]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          },
          success: { iconTheme: { primary: '#00b894', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e17055', secondary: '#fff' } },
        }}
      />
      {children}
    </>
  );
}
