'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiPrinter, FiArrowRight, FiMail, FiPhone } from 'react-icons/fi';
import { formatPrice } from '@/lib/helpers';
import { companyInfo } from '@/lib/mockData';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'KRM-SAMPLE-ORDER';
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('last_order');
    if (raw) {
      try {
        setOrderData(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <FiCheckCircle />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          Payment & Order Successful
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          Your order has been received by <strong className="text-gray-900">KRUMAK TRADERS</strong> and is being prepared for calibration, quality check, and dispatched.
        </p>

        {/* Order Reference Card */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 text-left max-w-xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Reference ID</p>
              <p className="text-lg font-mono font-bold text-[#0f4c81]">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">
                {orderData?.total ? formatPrice(orderData.total) : 'Paid online'}
              </p>
            </div>
          </div>

          <div className="pt-4 grid sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-semibold text-gray-900 block mb-0.5">Shipping Destination:</span>
              <p>{orderData?.customer?.address || 'Laboratory Address registered'}</p>
              <p>{orderData?.customer?.city} {orderData?.customer?.pincode}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-900 block mb-0.5">Contact Notification:</span>
              <p>{orderData?.customer?.email || 'Confirmation email dispatched'}</p>
              <p>{orderData?.customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <span className="font-bold text-xs text-[#0f4c81] uppercase block mb-1">Step 1</span>
            <p className="text-xs font-semibold text-gray-900 mb-1">Technical QC</p>
            <p className="text-[11px] text-gray-500 leading-normal">Instruments inspected and calibrated per ISO standards.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <span className="font-bold text-xs text-[#0f4c81] uppercase block mb-1">Step 2</span>
            <p className="text-xs font-semibold text-gray-900 mb-1">Heavy Logistics</p>
            <p className="text-[11px] text-gray-500 leading-normal">Securely crated with shock absorption and insured freight.</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <span className="font-bold text-xs text-[#0f4c81] uppercase block mb-1">Step 3</span>
            <p className="text-xs font-semibold text-gray-900 mb-1">Doorstep Handover</p>
            <p className="text-[11px] text-gray-500 leading-normal">Delivered with tax invoice, warranty cards, and user guides.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <FiPrinter /> Print Receipt
          </button>
          <Link href="/products/all" className="btn-primary !py-3 !px-6 text-sm">
            Continue Shopping <FiArrowRight />
          </Link>
          <Link href="/auth/profile" className="btn-secondary !py-3 !px-6 text-sm">
            View in Order History
          </Link>
        </div>

        {/* Support note */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <FiPhone className="text-[#00b894]" /> Questions? Call {companyInfo.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <FiMail className="text-[#00b894]" /> Email: {companyInfo.salesEmail}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      <Suspense fallback={<div className="py-20 text-center">Loading confirmation...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
