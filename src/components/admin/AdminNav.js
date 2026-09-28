'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBox, FiShoppingBag, FiMessageSquare, FiUsers, FiArrowLeft } from 'react-icons/fi';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/products', label: 'Products', icon: FiBox },
    { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { href: '/admin/inquiries', label: 'Inquiries', icon: FiMessageSquare },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">
            ADM
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">KRUMAK TRADERS Admin Console</h2>
            <p className="text-[11px] text-slate-400">Inventory, Orders, Inquiries & User Management</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="text-sm" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors ml-2"
          >
            <FiArrowLeft /> Live Store
          </Link>
        </div>
      </div>
    </div>
  );
}
