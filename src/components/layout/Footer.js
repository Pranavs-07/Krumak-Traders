'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin, FiSend, FiArrowUp } from 'react-icons/fi';
import { companyInfo } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Products', href: '/products/all' },
    { label: 'Request Quote', href: '/quote' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ];

  const categoryLinks = [
    { label: 'Analytical/Chromatography', href: '/products/analytical-chromatography' },
    { label: 'Life Science', href: '/products/life-science' },
    { label: 'Microscopes', href: '/products/microscopes' },
    { label: 'Chemical Balances', href: '/products/chemical-balances' },
    { label: 'Glassware', href: '/products/borosilicate-glassware' },
    { label: 'Educational Kits', href: '/products/educational-kits' },
  ];

  return (
    <footer className="relative">
      {/* Newsletter section */}
      <div className="bg-gradient-to-r from-[#0f4c81] to-[#00b894] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Stay Updated
              </h3>
              <p className="text-white/80 text-sm md:text-base">Get the latest products, offers, and industry insights delivered to your inbox.</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-72 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 outline-none focus:bg-white/20 focus:border-white/40 transition-all text-sm backdrop-blur-sm"
                required
              />
              <button type="submit" className="px-6 py-3 bg-white text-[#0f4c81] font-bold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg flex items-center gap-2 text-sm shrink-0">
                <FiSend /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-[#0a1628] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
            {/* Company info */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f4c81] to-[#00b894] flex items-center justify-center text-white font-bold text-xl shadow-lg">K</div>
                <div>
                  <h4 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>KRUMAK</h4>
                  <p className="text-[10px] text-gray-400 tracking-widest -mt-0.5">TRADERS</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{companyInfo.description.substring(0, 150)}...</p>
              <div className="flex gap-3">
                {[
                  { icon: FiFacebook, href: companyInfo.social.facebook },
                  { icon: FiTwitter, href: companyInfo.social.twitter },
                  { icon: FiLinkedin, href: companyInfo.social.linkedin },
                  { icon: FiInstagram, href: companyInfo.social.instagram },
                ].map(({ icon: Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#0f4c81] hover:text-white transition-all">
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#00b894] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Top Categories</h4>
              <ul className="space-y-2.5">
                {categoryLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#00b894] transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Contact Us</h4>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <FiMapPin className="text-[#00b894] mt-1 shrink-0" />
                  <p className="text-gray-400 text-sm">{companyInfo.address}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <FiPhone className="text-[#00b894] shrink-0" />
                  <a href={`tel:${companyInfo.phone}`} className="text-gray-400 hover:text-white transition-colors text-sm">{companyInfo.phone}</a>
                </div>
                <div className="flex gap-3 items-center">
                  <FiMail className="text-[#00b894] shrink-0" />
                  <a href={`mailto:${companyInfo.email}`} className="text-gray-400 hover:text-white transition-colors text-sm">{companyInfo.email}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} KRUMAK TRADERS. All rights reserved.
            </p>
            <button onClick={scrollToTop} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
              Back to top <FiArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
