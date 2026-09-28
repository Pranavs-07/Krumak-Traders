import { companyInfo } from '@/lib/mockData';

export default function PrivacyPage() {
  return (
    <div className="page-enter bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last Updated: January 2024</p>

          <div className="prose text-gray-600 text-xs sm:text-sm leading-relaxed space-y-6">
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">1. Data Collected</h2>
              <p>KRUMAK TRADERS collects essential institutional details including contact personnel name, designation, university/company email, telephone number, and delivery address to process quotations, invoices, and physical dispatch of scientific equipment.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">2. Use of Information</h2>
              <p>Your details are strictly utilized to coordinate order fulfillment, generate tax compliant proforma invoices, provide firmware/software updates, and dispatch warranty documentation. We do not sell or monetize client laboratory data.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">3. Payment Information Security</h2>
              <p>KRUMAK TRADERS does not retain complete credit card or net-banking credentials on our servers. All digital transactions are processed through encrypted 256-bit payment gateways compliant with PCI-DSS standards.</p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">4. Research Confidentiality</h2>
              <p>We respect the sensitive proprietary nature of advanced research inquiries. Technical requirements, custom column specifications, and custom biological models requested remain confidential.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
            For privacy queries, write to our Data Officer at <a href={`mailto:${companyInfo.email}`} className="text-[#0f4c81] font-semibold">{companyInfo.email}</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
