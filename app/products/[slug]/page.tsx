'use client';

import { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, Share2, CheckCircle, Info, Package, BadgeCheck } from 'lucide-react';
import { ModernLoader } from '@/components/ui/ModernLoader';

import { getProduct } from '../../../sanity/lib/api';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Product as GlobalProduct } from '@/types';
import ReviewSection from '@/components/ReviewSection';
import ProductVariantSelector from '@/components/ProductVariantSelector';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params) as { slug: string };
  const [product, setProduct] = useState<GlobalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        const productData = await getProduct(slug);
        if (!productData) {
          notFound();
          return;
        }
        if (!cancelled) {
          const transformedProduct: GlobalProduct = {
            ...productData,
            images: productData.images || [],
            categories: productData.categories?.map((category: { _ref: string; _id: string; slug: { current: string } | string; name: string }) => ({
              _id: category._ref || category._id,
              slug: { current: typeof category.slug === 'string' ? category.slug : category.slug?.current || '' },
              name: category.name,
              _ref: category._ref || category._id,
            })) || [],
          };
          setProduct(transformedProduct);
        }
      } catch { 
        console.error('Error fetching product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ModernLoader size="lg" text="Loading product..." />
          <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
    return null;
  }

  const safePrice = product?.price ? Number(product.price) : 0;
  const safeDiscount = product?.discount ? Number(product.discount) : 0;
  const finalPrice = safeDiscount > 0 ? safePrice - (safePrice * safeDiscount) / 100 : safePrice;

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    try {
      await addToCart(product, quantity, selectedSize, selectedColor);
      setTimeout(() => setAddToCartLoading(false), 1000);
    } catch {
      setAddToCartLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const images = product?.images ? [...product.images] : [];
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Simple Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft size={16} />
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products
            </Link>
            {product.categories?.[0] && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/products?category=${typeof product.categories[0].slug === 'string' ? product.categories[0].slug : product.categories[0].slug?.current}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium max-w-[200px] truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Images */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {images.length > 0 ? (
                    <Image
                      src={urlFor((images[activeImageIndex] ?? images[0]) as { asset: { _ref: string } }).url()}
                      alt={product.name || 'Product Image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {safeDiscount > 0 && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{safeDiscount}% OFF
                      </div>
                    )}
                    {product.inStock && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        In Stock
                      </div>
                    )}
                  </div>

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300 rotate-180" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`relative aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImageIndex === index
                            ? 'border-blue-500 scale-110'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={urlFor(image).url()}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-white dark:bg-gray-800">
              <div className="space-y-6">
                {/* Product Header */}
                <div className="space-y-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product.name}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < Math.floor(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                  <div className="space-y-2">
                    {safeDiscount > 0 ? (
                      <>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            {formatPrice(safePrice)}
                          </span>
                          <div className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                            Save {formatPrice(safePrice - finalPrice)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(safePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Variants */}
                <ProductVariantSelector
                  sizes={product.sizes || []}
                  colors={product.colors || []}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSizeChange={setSelectedSize}
                  onColorChange={setSelectedColor}
                />

                {/* Stock & Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${
                    product.inStock 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {product.inStock ? (
                        <>
                          <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-800 dark:text-green-300 text-sm">In Stock</span>
                        </>
                      ) : (
                        <>
                          <Info size={18} className="text-red-600 dark:text-red-400" />
                          <span className="font-semibold text-red-800 dark:text-red-300 text-sm">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Truck size={18} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Free Shipping</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                      <button
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        disabled={!product.inStock || quantity <= 1}
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        <Minus size={18} />
                      </button>
                      <div className="px-6 py-3 border-l border-r border-gray-300 dark:border-gray-600 min-w-[4rem] text-center font-bold text-lg">
                        {quantity}
                      </div>
                      <button
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        disabled={!product.inStock}
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    
                    {finalPrice * quantity !== finalPrice && (
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Total: {formatPrice(finalPrice * quantity)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-lg transition-colors ${
                      isWishlisted 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500'
                    }`}
                  >
                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                  </button>

                  <button className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-colors">
                    <Share2 size={20} />
                  </button>

                  <Button
                    className={`flex-1 py-3 flex items-center justify-center gap-2 text-lg font-semibold ${
                      addToCartLoading 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : product.inStock 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors rounded-lg`}
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    {addToCartLoading ? (
                      <>
                        <CheckCircle size={20} />
                        Added to Cart!
                      </>
                    ) : product.inStock ? (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    ) : (
                      <>
                        <Info size={20} />
                        Out of Stock
                      </>
                    )}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto w-fit">
                        <Shield size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">Secure Payment</div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto w-fit">
                        <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">Fast Delivery</div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mx-auto w-fit">
                        <BadgeCheck size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">Quality Assured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 lg:p-6">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                    activeTab === 'description'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Description
                </button>
                {product.features?.length ? (
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                      activeTab === 'features'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Features
                  </button>
                ) : null}
                {product.categories?.length ? (
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${
                      activeTab === 'categories'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    Categories
                  </button>
                ) : null}
              </div>

                              {/* Tab Content */}
                <div className="space-y-6">
                  {/* Description Tab */}
                  {activeTab === 'description' && product.description && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Product Description
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Features Tab */}
                  {activeTab === 'features' && product.features?.length ? (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Key Features
                      </h2>
                      <div className="space-y-2">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Categories Tab */}
                  {activeTab === 'categories' && product.categories?.length ? (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Product Categories
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {product.categories.map((category) => {
                          const slugValue = typeof category.slug === 'string' ? category.slug : category.slug?.current ?? '';
                          return (
                            <Link
                              key={category._id}
                              href={`/products?category=${slugValue}`}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-2 font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              {category.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                             {/* Explore More */}
               <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 text-center border border-gray-200 dark:border-gray-600">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                   Explore More Products
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-4">
                   Discover more amazing products in our collection
                 </p>
                 <Link 
                   href="/products" 
                   className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
                 >
                   Browse Products
                   <ArrowLeft size={18} className="rotate-180" />
                 </Link>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewSection 
            productId={product._id} 
            productName={product.name} 
          />
        </div>
      </div>
    </div>
  );
}