'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, Share2, Eye, Zap, Award, Clock, CheckCircle, Info, Sparkles, Package, BadgeCheck, TrendingUp } from 'lucide-react';
import { ModernLoader } from '@/components/ui/ModernLoader';

import { getProduct } from '../../../sanity/lib/api';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Product as GlobalProduct } from '@/types';

export const dynamic = 'force-dynamic';

interface Category {
  _id: string;
  name: string;
  slug: string | { current: string };
}

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const [product, setProduct] = useState<GlobalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 500) + 100);
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
            categories: productData.categories?.map((category: any) => ({
              _id: category._ref || category._id,
              slug: typeof category.slug === 'string' ? category.slug : category.slug?.current || '',
              name: category.name,
              _ref: category._ref || category._id,
            })) || [],
          };
          setProduct(transformedProduct);
        }
      } catch (error) { 
        console.error('Error fetching product:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Simulate view count increment
  useEffect(() => {
    const timer = setTimeout(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <ModernLoader size="lg" text="Loading product details..." />
          <div className="mt-6 space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Preparing something amazing</p>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
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
  const finalPrice =
    safeDiscount > 0 ? safePrice - (safePrice * safeDiscount) / 100 : safePrice;

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    try {
      await addToCart(product, quantity);
      // Add some visual feedback
      setTimeout(() => setAddToCartLoading(false), 1000);
    } catch (error) {
      setAddToCartLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const images = product?.images ? [...product.images] : [];

  // Mock rating for demo
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 50;
  const savings = safeDiscount > 0 ? safePrice - finalPrice : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Breadcrumb Navigation */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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

            {/* Live Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Eye size={14} />
                <span>{viewCount} views</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <TrendingUp size={14} />
                <span>Trending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="flex flex-col xl:flex-row">
            {/* Enhanced Product Images Gallery */}
            <div className="w-full xl:w-3/5 p-6 lg:p-8">
              <div className="space-y-6">
                {/* Main Image with Zoom */}
                <div className="relative">
                  <div className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group cursor-zoom-in ${
                    isImageZoomed ? 'cursor-zoom-out' : ''
                  }`}>
                    {images.length > 0 ? (
                      <>
                        <Image
                          src={urlFor(images[activeImageIndex] ?? images[0]).url()}
                          alt={product.name || 'Product Image'}
                          fill
                          className={`object-cover transition-all duration-700 ${
                            isImageZoomed ? 'scale-150' : 'group-hover:scale-110'
                          }`}
                          sizes="(max-width: 1280px) 100vw, 60vw"
                          priority
                          onClick={() => setIsImageZoomed(!isImageZoomed)}
                        />
                        
                        {/* Enhanced Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Floating Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {safeDiscount > 0 && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
                              <Zap size={14} />
                              -{safeDiscount}% OFF
                            </div>
                          )}
                          {product.inStock && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                              <CheckCircle size={14} />
                              In Stock
                            </div>
                          )}
                          {safeDiscount > 20 && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                              <Award size={14} />
                              Hot Deal
                            </div>
                          )}
                        </div>

                        {/* Zoom Hint */}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to zoom
                        </div>
                      </>
                    ) : (
                      <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded-2xl">
                        <div className="text-center">
                          <Package size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                          <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            No image available
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                        >
                          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => setActiveImageIndex(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                        >
                          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300 rotate-180" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {activeImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Enhanced Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((image, index) => (
                      <button
                        type="button"
                        key={index}
                        className={`relative aspect-square w-20 h-20 rounded-xl overflow-hidden border-3 flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                          activeImageIndex === index
                            ? 'border-blue-500 shadow-lg shadow-blue-500/25 scale-110'
                            : 'border-transparent hover:border-blue-300 hover:shadow-md'
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={urlFor(image).url()}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {activeImageIndex === index && (
                          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Product Details */}
            <div className="w-full xl:w-2/5 p-6 lg:p-8 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50">
              <div className="space-y-8 h-full">
                {/* Header with Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Premium Quality</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-4">
                      {product.name}
                    </h1>
                    
                    {/* Enhanced Rating */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={`${
                              i < Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            } transition-colors`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {rating} ({reviewCount} reviews)
                      </span>
                      <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs font-bold">
                        ⭐ Best Seller
                      </div>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{viewCount} people viewing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{Math.floor(Math.random() * 5) + 1} sold today</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                        isWishlisted 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-red-500/25' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30'
                      }`}
                    >
                      <Heart size={22} className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                    <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110 shadow-lg">
                      <Share2 size={22} />
                    </button>
                  </div>
                </div>

                {/* Enhanced Price Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="space-y-4">
                    {safeDiscount > 0 ? (
                      <>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-4xl lg:text-5xl font-black text-red-600 dark:text-red-400">
                            {formatPrice(finalPrice)}
                          </span>
                          <span className="text-2xl text-gray-500 line-through">
                            {formatPrice(safePrice)}
                          </span>
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                            Save {formatPrice(savings)}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <Zap size={20} />
                            <span className="font-bold">Limited Time Offer - {safeDiscount}% OFF!</span>
                          </div>
                          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                            Hurry! This deal won't last long.
                          </p>
                        </div>
                      </>
                    ) : (
                      <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100">
                        {formatPrice(safePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Enhanced Stock & Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border-2 ${
                    product.inStock 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {product.inStock ? (
                        <>
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                          <span className="font-bold text-green-800 dark:text-green-300">In Stock</span>
                        </>
                      ) : (
                        <>
                          <Info size={20} className="text-red-600 dark:text-red-400" />
                          <span className="font-bold text-red-800 dark:text-red-300">Out of Stock</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {product.inStock ? 'Ready to ship' : 'Notify when available'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                      <Truck size={20} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-blue-800 dark:text-blue-300">Free Shipping</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Delivery in 2-3 business days
                    </p>
                  </div>
                </div>

                {/* Enhanced Quantity Selector */}
                <div className="space-y-4">
                  <label className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Package size={20} />
                    Quantity
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                      <button
                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
                        disabled={!product.inStock || quantity <= 1}
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        <Minus size={20} />
                      </button>
                      <div className="px-8 py-4 border-l border-r border-gray-300 dark:border-gray-600 min-w-[5rem] text-center font-bold text-xl">
                        {quantity}
                      </div>
                      <button
                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
                        disabled={!product.inStock}
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">
                        {product.inStock ? '✅ Available' : '❌ Not available'}
                      </div>
                      {finalPrice * quantity !== finalPrice && (
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          Total: {formatPrice(finalPrice * quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Add to Cart Button */}
                <Button
                  className={`w-full py-5 flex items-center justify-center gap-3 text-lg font-bold transition-all duration-300 shadow-xl ${
                    addToCartLoading 
                      ? 'bg-green-500 hover:bg-green-600 scale-105' 
                      : product.inStock 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-blue-500/25' 
                        : 'bg-gray-400 cursor-not-allowed'
                  } active:scale-95 rounded-xl`}
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  {addToCartLoading ? (
                    <>
                      <CheckCircle size={24} className="animate-pulse" />
                      Added to Cart!
                    </>
                  ) : product.inStock ? (
                    <>
                      <ShoppingCart size={24} />
                      Add to Cart • {formatPrice(finalPrice * quantity)}
                    </>
                  ) : (
                    <>
                      <Info size={24} />
                      Out of Stock
                    </>
                  )}
                </Button>

                {/* Enhanced Trust Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto w-fit">
                        <Shield size={24} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Secure Payment</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">SSL Protected</div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto w-fit">
                        <Truck size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Fast Delivery</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">2-3 Days</div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-auto w-fit">
                        <BadgeCheck size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Quality Assured</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">100% Authentic</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Information Tabs */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="p-8">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'description'
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  📝 Description
                </button>
                {product.features?.length ? (
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'features'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    ⭐ Features
                  </button>
                ) : null}
                {product.categories?.length ? (
                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === 'categories'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    🏷️ Categories
                  </button>
                ) : null}
              </div>

              {/* Tab Content */}
              <div className="space-y-8">
                {/* Description Tab */}
                {activeTab === 'description' && product.description && (
                  <div className="animate-fade-in">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                          <Info size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                          Product Description
                        </h2>
                      </div>
                      <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="text-lg">{product.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && product.features?.length ? (
                  <div className="animate-fade-in">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                          <Star size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                          Key Features
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.features.map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Categories Tab */}
                {activeTab === 'categories' && product.categories?.length ? (
                  <div className="animate-fade-in">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                          <Package size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100">
                          Product Categories
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {product.categories.map((category, index) => {
                          const slugValue =
                            typeof category.slug === 'string'
                              ? category.slug
                              : category.slug?.current ?? '';
                          return (
                            <Link
                              key={category._id}
                              href={`/products?category=${slugValue}`}
                              className="group relative bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 px-6 py-4 rounded-xl font-bold text-purple-800 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                {category.name}
                                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              
                              {/* Hover Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                          );
                        })}
                      </div>
                      
                      <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          💡 Click on any category to explore similar products
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Related Products Suggestion */}
              <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    🔥 You might also like
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Discover more amazing products in our collection
                  </p>
                  <Link 
                    href="/products" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                  >
                    Explore More Products
                    <ArrowLeft size={20} className="rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .cursor-zoom-in {
          cursor: zoom-in;
        }
        
        .cursor-zoom-out {
          cursor: zoom-out;
        }
        
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
}