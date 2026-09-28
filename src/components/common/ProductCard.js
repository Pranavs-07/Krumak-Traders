'use client';
import Link from 'next/link';
import { FiShoppingCart, FiSend } from 'react-icons/fi';
import { useCartStore } from '@/context/store';
import { formatPrice, getDiscount } from '@/lib/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = getDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover relative">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-[#e17055] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
          {discount}% OFF
        </div>
      )}

      {/* Product image */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Link href={`/products/item/${product.id}`} className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500">
          🔬
        </Link>
        {/* Quick actions overlay */}
        <div className="absolute inset-0 pointer-events-none group-hover:bg-black/5 transition-all duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
          <div className="flex gap-2 pointer-events-auto">
            <button onClick={handleAddToCart} className="bg-white/95 backdrop-blur-sm text-[#0f4c81] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0f4c81] hover:text-white transition-all shadow-lg">
              <FiShoppingCart /> Add to Cart
            </button>
            <Link href={`/quote?product=${product.id}`} className="bg-white/95 backdrop-blur-sm text-[#00b894] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#00b894] hover:text-white transition-all shadow-lg">
              <FiSend /> Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 sm:p-5">
        <Link href={`/products/item/${product.id}`}>
          <p className="text-xs font-medium text-[#00b894] uppercase tracking-wider mb-1">{product.category?.replace(/-/g, ' ')}</p>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0f4c81] transition-colors text-sm sm:text-base" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3">{product.shortDescription}</p>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[#0f4c81]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
