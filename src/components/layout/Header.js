'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiChevronDown, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '@/context/store';
import { productService } from '@/lib/services';
import { formatPrice, debounce } from '@/lib/helpers';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const itemCount = getItemCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname, setMobileMenuOpen]);

  // Live search
  const doSearch = debounce(async (query) => {
    if (query.length < 2) { setSearchResults([]); return; }
    const data = await productService.searchProducts(query);
    setSearchResults(data.suggestions || []);
  }, 300);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchOpen(true);
    doSearch(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products/all', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/quote', label: 'Request Quote' },
  ];

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#0f4c81] to-[#0a1628] text-white text-center py-2 px-4 text-sm font-medium">
        <span className="hidden sm:inline">🔬 Trusted by 500+ laboratories across India — </span>
        <span>Free shipping on orders above ₹50,000</span>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0f4c81] to-[#00b894] flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-md">
                K
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-extrabold text-[#0f4c81] tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>KRUMAK</h1>
                <p className="text-[10px] md:text-xs text-[#64748b] font-medium tracking-widest -mt-0.5">TRADERS</p>
              </div>
            </Link>

            {/* Search bar - desktop */}
            <div ref={searchRef} className="hidden lg:block flex-1 max-w-xl mx-8 relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search for lab equipment, instruments, chemicals..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border-2 border-transparent focus:border-[#0f4c81] focus:bg-white focus:shadow-lg transition-all outline-none text-sm"
                  />
                </div>
              </form>
              {/* Search suggestions dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down z-50">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/item/${item.id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">🔬</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-[#00b894] font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/products/all?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="block text-center py-3 text-sm font-semibold text-[#0f4c81] bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    View all results for &ldquo;{searchQuery}&rdquo;
                  </Link>
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile search toggle */}
              <button onClick={() => router.push('/products/all')} className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <FiSearch className="text-xl" />
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                <FiShoppingCart className="text-xl" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#e17055] text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth */}
              {isAuthenticated ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0f4c81] to-[#00b894] flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                    <FiChevronDown className="hidden md:block text-gray-400 text-sm" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down z-50">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-semibold text-sm text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link href="/auth/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiUser className="text-gray-400" /> My Profile
                      </Link>
                      <Link href="/auth/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiPackage className="text-gray-400" /> My Orders
                      </Link>
                      {isAdmin() && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <FiSettings className="text-gray-400" /> Admin Dashboard
                        </Link>
                      )}
                      <hr className="border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="btn-primary !py-2 !px-4 text-sm">
                  <FiUser /> <span className="hidden md:inline">Login</span>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1 pb-3 -mt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#0f4c81] bg-blue-50'
                    : 'text-gray-600 hover:text-[#0f4c81] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#0f4c81] transition-all outline-none text-sm"
                  />
                </div>
              </form>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-[#0f4c81] bg-blue-50'
                        : 'text-gray-600 hover:text-[#0f4c81] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && isAdmin() && (
                  <Link href="/admin" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-[#0f4c81] hover:bg-gray-50">
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
