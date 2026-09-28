'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiPackage } from 'react-icons/fi';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { productService, adminService } from '@/lib/services';
import { formatPrice } from '@/lib/helpers';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ limit: 50 });
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await adminService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success(`Product "${name}" deleted`);
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute adminOnly>
      <div className="page-enter bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdminNav />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  Equipment Inventory & Catalog
                </h1>
                <p className="text-xs text-gray-500">Manage lab instrument listings, prices, categories, and stock limits</p>
              </div>

              <Link
                href="/admin/products/new"
                className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FiPlus /> Add New Equipment
              </Link>
            </div>

            {/* Search filter */}
            <div className="mb-6 relative max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by title or category..."
                className="input-field pl-11 !py-2 text-xs"
              />
            </div>

            {/* Product table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Unit Price</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
                            🔬
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-600 capitalize">
                        {p.category?.replace(/-/g, ' ')}
                      </td>
                      <td className="py-3.5 font-bold text-gray-900">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/edit/${p.id}`}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#0f4c81] hover:bg-gray-100 transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
