'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiSend, FiMinus, FiPlus, FiChevronRight, FiCheck, FiPackage, FiShield, FiTruck } from 'react-icons/fi';
import { productService } from '@/lib/services';
import { useCartStore } from '@/context/store';
import { formatPrice, getDiscount } from '@/lib/helpers';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await productService.getProduct(id);
      setProduct(data.product);
      setRelated(data.related || []);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRequestQuote = () => {
    router.push(`/quote?product=${product.id}&name=${encodeURIComponent(product.name)}`);
  };

  if (loading) return <LoadingSpinner text="Loading product details..." />;
  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products/all" className="btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const discount = getDiscount(product.originalPrice, product.price);

  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0f4c81]">Home</Link>
            <FiChevronRight className="text-xs" />
            <Link href="/products/all" className="hover:text-[#0f4c81]">Products</Link>
            <FiChevronRight className="text-xs" />
            <Link href={`/products/${product.category}`} className="hover:text-[#0f4c81] capitalize">{product.category?.replace(/-/g, ' ')}</Link>
            <FiChevronRight className="text-xs" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Product main section */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image gallery */}
            <div className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden mb-4">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#e17055] text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">{discount}% OFF</div>
                )}
                <div className="text-8xl md:text-9xl">🔬</div>
              </div>
              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl border-2 transition-all ${selectedImage === i ? 'border-[#0f4c81] shadow-md' : 'border-transparent hover:border-gray-300'}`}>
                      🔬
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="p-6 md:p-10 flex flex-col">
              <p className="text-sm font-semibold text-[#00b894] uppercase tracking-wider mb-2">{product.category?.replace(/-/g, ' ')}</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                </div>
              )}

              <p className="text-gray-600 mb-6">{product.shortDescription}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-extrabold text-[#0f4c81]">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-sm font-bold text-[#00b894] bg-emerald-50 px-2 py-1 rounded-md">Save {formatPrice(product.originalPrice - product.price)}</span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg"><FiCheck /> In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">Out of Stock</span>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 hover:bg-gray-50 transition-colors"><FiMinus /></button>
                  <span className="px-4 py-2.5 font-semibold text-sm min-w-[3rem] text-center border-x border-gray-200">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="px-3 py-2.5 hover:bg-gray-50 transition-colors"><FiPlus /></button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 justify-center !py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button onClick={handleRequestQuote} className="btn-accent flex-1 justify-center !py-4">
                  <FiSend /> Request Quote
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                {[
                  { icon: FiPackage, label: 'Secure Packaging' },
                  { icon: FiShield, label: 'Warranty Included' },
                  { icon: FiTruck, label: 'Fast Delivery' },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="text-center">
                    <Icon className="text-[#0f4c81] mx-auto mb-1 text-lg" />
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description & Specifications */}
        <div className="bg-white rounded-3xl border border-gray-100 mt-6 overflow-hidden shadow-sm">
          <div className="border-b border-gray-100 flex">
            {['description', 'specifications'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 sm:flex-none px-6 md:px-8 py-4 text-sm font-semibold transition-all ${activeTab === tab ? 'text-[#0f4c81] border-b-2 border-[#0f4c81]' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-10">
            {activeTab === 'description' ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-5 py-3 font-semibold text-gray-900 text-sm w-1/3">{key}</td>
                        <td className="px-5 py-3 text-gray-600 text-sm">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
