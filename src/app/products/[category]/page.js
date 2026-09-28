'use client';
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiList, FiFilter, FiX, FiChevronRight } from 'react-icons/fi';
import { productService } from '@/lib/services';
import { categories as allCategories } from '@/lib/mockData';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

export default function ProductCatalogPage({ params }) {
  const { category } = use(params);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', sortBy: 'name' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentCategory = allCategories.find(c => c.id === category);
  const isAll = category === 'all';

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, currentPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(isAll ? {} : { category }),
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
      };
      const data = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', sortBy: 'name' });
    setCurrentPage(1);
  };

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      {/* Breadcrumb & header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#0f4c81]">Home</Link>
            <FiChevronRight className="text-xs" />
            <Link href="/products/all" className="hover:text-[#0f4c81]">Products</Link>
            {!isAll && currentCategory && (
              <>
                <FiChevronRight className="text-xs" />
                <span className="text-gray-900 font-medium">{currentCategory.name}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {searchQuery ? `Search: "${searchQuery}"` : isAll ? 'All Products' : currentCategory?.name || 'Products'}
              </h1>
              {currentCategory && !isAll && (
                <p className="text-gray-500 text-sm mt-1">{currentCategory.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors lg:hidden">
                <FiFilter /> Filters
              </button>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#0f4c81] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FiGrid /></button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-[#0f4c81] text-white' : 'text-gray-500 hover:bg-gray-50'}`}><FiList /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className={`${filterOpen ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-64 shrink-0`}>
            <div className={`${filterOpen ? 'absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl overflow-y-auto' : ''} lg:relative lg:w-auto lg:shadow-none lg:p-0`}>
              {filterOpen && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}><FiX className="text-xl" /></button>
                </div>
              )}

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-1">
                  <Link href="/products/all" className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isAll ? 'bg-blue-50 text-[#0f4c81] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    All Products
                  </Link>
                  {allCategories.map(cat => (
                    <Link key={cat.id} href={`/products/${cat.id}`} className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.id ? 'bg-blue-50 text-[#0f4c81] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
                <div className="space-y-3">
                  <input type="number" placeholder="Min Price (₹)" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="input-field !py-2.5 text-sm" />
                  <input type="number" placeholder="Max Price (₹)" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="input-field !py-2.5 text-sm" />
                  <button onClick={clearFilters} className="text-sm text-[#e17055] font-medium hover:underline">Clear Filters</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner text="Loading products..." />
            ) : products.length === 0 ? (
              <EmptyState icon="🔍" title="No products found" description={searchQuery ? `No results for "${searchQuery}". Try different keywords.` : 'No products in this category yet.'} actionLabel="Browse All Products" actionHref="/products/all" />
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-6">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                  {products.map(product => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.id} product={product} />
                    ) : (
                      <Link key={product.id} href={`/products/item/${product.id}`} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-4 card-hover">
                        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-3xl shrink-0">🔬</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#00b894] uppercase tracking-wider">{product.category?.replace(/-/g, ' ')}</p>
                          <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.shortDescription}</p>
                          <p className="text-lg font-bold text-[#0f4c81] mt-2">{product.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</p>
                        </div>
                      </Link>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === i + 1 ? 'bg-[#0f4c81] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
