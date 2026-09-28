'use client';
import Link from 'next/link';
import { FiCheckCircle, FiAward, FiShield, FiTrendingUp, FiArrowRight, FiUsers } from 'react-icons/fi';
import { companyInfo } from '@/lib/mockData';

export default function AboutPage() {
  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0a1628] via-[#0f4c81] to-[#0a1628] text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-400 mb-4 border border-white/10">
            Celebrating 10+ Years of Scientific Partnership
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-6 max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Empowering Scientific Discovery & Academic Excellence
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            KRUMAK TRADERS is a premier firm supplying precision laboratory apparatus, analytical instruments, and consumables across India.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
              A Decade Dedicated to Laboratory Precision
            </h2>
            <div className="prose text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                <strong>KRUMAK TRADERS</strong> was established with a singular objective: to eliminate the friction research scholars, educators, and laboratory managers face when procuring high-grade scientific apparatus.
              </p>
              <p>
                With over 10 years of field experience, we have evolved into a trusted one-stop supplier for premier institutions—including IITs, NITs, AIIMS, pharmaceutical QA/QC hubs, and testing centers nationwide.
              </p>
              <p>
                From micro-volume chromatography columns and digital analytical balances to complete higher-secondary educational chemistry kits, our catalog represents uncompromised standards of durability, calibration accuracy, and safety compliance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                { title: 'ISO Calibrated Standards', desc: 'Traceability and certificates provided with precision equipment.' },
                { title: 'End-to-End Logistical Care', desc: 'Specialized protective crating for fragile borosilicate glassware.' },
                { title: 'Dedicated Field Engineers', desc: 'Assistance with site-readiness, installation, and IQ/OQ.' },
                { title: 'Academic & Institutional Grants', desc: 'Support with tender documentation, proforma bills, and tax breaks.' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-xs text-gray-900 mb-1 flex items-center gap-1.5">
                    <FiCheckCircle className="text-[#00b894]" /> {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#0f4c81] to-[#00b894] p-8 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4">Our Operational Values</h3>
                <ul className="space-y-4 text-xs sm:text-sm text-white/90">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                    <span><strong>Integrity of Spec:</strong> We never compromise on raw materials, ensuring 3.3 borosilicate glass and certified electronics.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
                    <span><strong>Transparent Quotations:</strong> Clear breakdowns of GST, customs, freight, and optional warranty extensions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
                    <span><strong>Long-Term Partnership:</strong> Availability of replacement parts, glass attachments, and consumables years after initial purchase.</span>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{companyInfo.stats[1].value}</p>
                    <p className="text-[11px] text-white/70">Equipment Catalog Items</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">{companyInfo.stats[2].value}</p>
                    <p className="text-[11px] text-white/70">Research Laboratories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Need to Set Up a New Research or University Laboratory?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-6">
            Speak directly with our technical instrumentation consultants for complete turnkey lab packages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary !py-3 !px-6 text-xs">
              Request Turnkey Quote <FiArrowRight />
            </Link>
            <Link href="/contact" className="btn-secondary !py-3 !px-6 text-xs">
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
