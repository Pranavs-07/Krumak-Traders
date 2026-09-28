'use client';
import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/context/store';
import { formatPrice } from '@/lib/helpers';
import EmptyState from '@/components/common/EmptyState';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleRemove = (item) => {
    removeItem(item.id);
    toast.success(`${item.name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyState icon="🛒" title="Your cart is empty" description="Looks like you haven't added any products yet. Browse our catalog to find what you need." actionLabel="Browse Products" actionHref="/products/all" />
      </div>
    );
  }

  return (
    <div className="page-enter bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Shopping Cart</h1>
          <Link href="/products/all" className="flex items-center gap-2 text-sm text-[#0f4c81] font-medium hover:underline">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex gap-4 sm:gap-6 card-hover">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-3xl shrink-0">🔬</div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/item/${item.id}`} className="font-bold text-gray-900 hover:text-[#0f4c81] transition-colors line-clamp-1">{item.name}</Link>
                  <p className="text-lg font-bold text-[#0f4c81] mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"><FiMinus className="text-sm" /></button>
                      <span className="px-3 py-1.5 font-semibold text-sm border-x border-gray-200 min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors"><FiPlus className="text-sm" /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => handleRemove(item)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600">{subtotal >= 50000 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-[#0f4c81]">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full justify-center !py-4">
                <FiShoppingBag /> Proceed to Checkout
              </Link>
              <p className="text-xs text-center text-gray-400 mt-4">Taxes and shipping calculated at checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
