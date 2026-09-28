'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiShield, FiTruck, FiHeadphones, FiAward, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { categories, products, testimonials, companyInfo } from '@/lib/mockData';
import { formatPrice } from '@/lib/helpers';
import ProductCard from '@/components/common/ProductCard';

export default function HomePage() {
  const featuredProducts = products.filter(p => p.featured);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-enter">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-dark)' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0f4c81]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00b894]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#0f4c81]/5 to-[#00b894]/5 rounded-full blur-3xl"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 mb-6 border border-white/10">
                <span className="w-2 h-2 bg-[#00b894] rounded-full animate-pulse"></span>
                Trusted by 500+ Labs Nationwide
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Precision
                <span className="bg-gradient-to-r from-[#00b894] to-[#00d4a8] bg-clip-text text-transparent"> Equipment</span>
                <br />for Modern Labs
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Your trusted partner in laboratory excellence. Over 10 years supplying premium scientific instruments, chemicals, and lab consumables to institutions across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products/all" className="btn-primary !py-4 !px-8 text-base group">
                  Explore Products
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/quote" className="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-[#0f4c81] !py-4 !px-8 text-base">
                  Request a Quote
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
                {companyInfo.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</p>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-[420px] h-[420px]">
                {/* Central circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#0f4c81]/30 to-[#00b894]/30 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-3">🔬</div>
                    <p className="text-white/80 font-semibold text-sm">5000+ Products</p>
                  </div>
                </div>
                {/* Orbiting icons — positions are static so SSR and client HTML match */}
                {[
                  { emoji: '⚗️', left: '92.86%', top: '50%', delay: '[animation-delay:0s]' },
                  { emoji: '🧬', left: '71.43%', top: '87.12%', delay: '[animation-delay:0.5s]' },
                  { emoji: '🔭', left: '28.57%', top: '87.12%', delay: '[animation-delay:1s]' },
                  { emoji: '⚖️', left: '7.14%', top: '50%', delay: '[animation-delay:1.5s]' },
                  { emoji: '🧪', left: '28.57%', top: '12.88%', delay: '[animation-delay:2s]' },
                  { emoji: '🫧', left: '71.43%', top: '12.88%', delay: '[animation-delay:2.5s]' },
                ].map((item) => (
                  <div
                    key={item.emoji}
                    className={`absolute w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/10 animate-float shadow-lg ${item.delay}`}
                    style={{
                      left: item.left,
                      top: item.top,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BADGES ==================== */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiShield, label: 'Quality Assured', desc: 'ISO certified products' },
              { icon: FiTruck, label: 'Pan-India Delivery', desc: 'Free above ₹50,000' },
              { icon: FiHeadphones, label: 'Expert Support', desc: 'Technical consultation' },
              { icon: FiAward, label: '10+ Years Trust', desc: 'Industry experience' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center shrink-0">
                  <Icon className="text-[#0f4c81] text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#00b894] uppercase tracking-wider mb-2">Browse Our Collection</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Product Categories</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Explore our comprehensive range of laboratory equipment across {categories.length} specialized categories</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.slice(0, 10).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/products/${cat.id}`}
                className="group bg-white rounded-2xl p-5 text-center border border-gray-100 card-hover relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f4c81]/0 to-[#00b894]/0 group-hover:from-[#0f4c81]/5 group-hover:to-[#00b894]/5 transition-all duration-500"></div>
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[#0f4c81] transition-colors">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products/all" className="inline-flex items-center gap-2 text-[#0f4c81] font-semibold hover:gap-3 transition-all">
              View All Categories <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <p className="text-sm font-semibold text-[#00b894] uppercase tracking-wider mb-2">Handpicked for You</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Featured Products</h2>
            </div>
            <Link href="/products/all" className="btn-secondary !py-2.5 !px-5 text-sm">
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT SNIPPET ==================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-[#00b894] uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                A Decade of Excellence in Lab Equipment Supply
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">{companyInfo.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Premium Quality', desc: 'From reputed manufacturers' },
                  { label: 'Competitive Pricing', desc: 'Best value for your investment' },
                  { label: 'Expert Consultation', desc: 'Technical guidance & support' },
                  { label: 'After-Sales Service', desc: 'Maintenance & warranty' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-primary">
                Learn More About Us <FiArrowRight />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#0f4c81] to-[#00b894] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative">
                  <div className="text-6xl mb-6">🏆</div>
                  <h3 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>10+ Years</h3>
                  <p className="text-white/80 mb-8">of trusted laboratory equipment supply across India</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-3xl font-bold">5000+</p>
                      <p className="text-white/60 text-sm">Products</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">500+</p>
                      <p className="text-white/60 text-sm">Clients Served</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">100+</p>
                      <p className="text-white/60 text-sm">Cities</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">99%</p>
                      <p className="text-white/60 text-sm">Satisfaction Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[#00b894] uppercase tracking-wider mb-2">What Our Clients Say</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Trusted by Industry Leaders</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 relative">
              <div className="absolute top-6 left-8 text-6xl text-[#0f4c81]/10 font-serif">&ldquo;</div>
              <div className="relative">
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-yellow-400 text-lg" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center mb-6 italic">
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-gray-500">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentTestimonial ? 'bg-[#0f4c81] w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#0f4c81] via-[#1a6bb5] to-[#00b894] rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Ready to Equip Your Lab?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Get in touch with our team for customized quotes, bulk orders, and expert consultation for your laboratory needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quote" className="bg-white text-[#0f4c81] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all hover:shadow-xl text-base">
                  Request a Quote
                </Link>
                <Link href="/contact" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-[#0f4c81] transition-all text-base">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
