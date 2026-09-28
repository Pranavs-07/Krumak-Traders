import Link from 'next/link';
import { companyInfo } from '@/lib/mockData';

export default function TermsPage() {
  return (
    <div className="page-enter bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Terms & Conditions of Supply
          </h1>
          <p className="text-xs text-gray-400 mb-8">Effective Date: January 1, 2024 | Version 2.4</p>

          <div className="prose text-gray-600 text-xs sm:text-sm leading-relaxed space-y-6">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">1. Scope of Agreement</h2>
              <p>These Terms & Conditions govern all sales of laboratory apparatus, analytical instruments, chemical reagents, glassware, and educational kits supplied by KRUMAK TRADERS (&ldquo;Seller&rdquo;) to purchasing entities (&ldquo;Buyer&rdquo;).</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">2. Quotations & Pricing</h2>
              <p>All formal quotes are valid for a duration of 30 calendar days from the date of issuance unless explicitly specified. Prices do not include local state levies, customs duties, or unloading insurance unless itemized.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">3. Delivery & Transit Risk</h2>
              <p>Equipment is packaged in compliance with industry transit standards for sensitive scientific instruments. For fragile borosilicate glassware, any transit breakages must be notified within 48 hours of shipment delivery with photographic evidence.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">4. Warranty & Calibration</h2>
              <p>Major electronic instrumentation (Spectrophotometers, HPLCs, Balances, Centrifuges) carries standard 12-month manufacturer warranties against defect in materials and craftsmanship. Consumables and reagents are guaranteed up to the stated shelf-life upon delivery.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">5. Institutional Purchase Orders</h2>
              <p>Government institutes, universities, and accredited research facilities may submit authorized Purchase Orders against approved proforma invoices subject to KRUMAK TRADERS credit verification.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
            For legal inquiries, contact <a href={`mailto:${companyInfo.email}`} className="text-[#0f4c81] font-semibold">{companyInfo.email}</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
