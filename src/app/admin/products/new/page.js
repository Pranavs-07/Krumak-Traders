'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AdminNav from '@/components/admin/AdminNav';
import { adminService } from '@/lib/services';
import { categories } from '@/lib/mockData';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'analytical-chromatography',
    price: '',
    originalPrice: '',
    stock: '',
    shortDescription: '',
    description: '',
  });

  const [specs, setSpecs] = useState([
    { key: 'Warranty', value: '1 Year Manufacturer' },
    { key: 'Power Supply', value: '220V / 50Hz' }
  ]);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (idx) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx, field, val) => {
    const next = [...specs];
    next[idx][field] = val;
    setSpecs(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please enter name, price, and initial stock');
      return;
    }

    setSubmitting(true);
    try {
      const specifications = {};
      specs.forEach(s => {
        if (s.key.trim()) specifications[s.key.trim()] = s.value.trim();
      });

      await adminService.createProduct({
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        specifications,
        image: '/products/placeholder.jpg',
      });

      toast.success('Equipment catalog entry created!');
      router.push('/admin/products');
    } catch (err) {
      toast.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="page-enter bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AdminNav />

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">
                <FiArrowLeft />
              </Link>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                Add New Scientific Instrument
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Title / Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g., Rotary Evaporator 5L with Chiller"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                    className="input-field"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(f => ({ ...f, stock: e.target.value }))}
                    placeholder="10"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Selling Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData(f => ({ ...f, price: e.target.value }))}
                    placeholder="75000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Original Price / MRP (INR ₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(f => ({ ...f, originalPrice: e.target.value }))}
                    placeholder="85000"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(f => ({ ...f, shortDescription: e.target.value }))}
                    placeholder="One-line summary for catalog cards"
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Technical Overview & Application
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                    placeholder="Detailed instrument description, compliance certifications, package components..."
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Dynamic Technical Specs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Technical Specifications (Key - Value Pairs)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-semibold text-[#0f4c81] flex items-center gap-1 hover:underline"
                  >
                    <FiPlus /> Add Specification
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((s, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Feature (e.g. Accuracy)"
                        value={s.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        className="input-field !py-2 text-xs w-1/3"
                      />
                      <input
                        type="text"
                        placeholder="Specification Value (e.g. ±0.01 mg)"
                        value={s.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="input-field !py-2 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Link href="/admin/products" className="btn-secondary !py-2.5 !px-5 text-xs">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FiSave /> {submitting ? 'Saving...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
