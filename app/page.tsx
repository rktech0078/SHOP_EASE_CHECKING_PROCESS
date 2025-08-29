import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import { getActiveBanners, getCategories, getFeaturedProducts } from '@/sanity/lib/api';
import { Suspense } from 'react';
import { ModernLoader } from '@/components/ui/ModernLoader';

export const metadata: Metadata = {
  title: 'ShopEase - Your One-Stop E-commerce Shop',
  description: 'Shop the latest products at affordable prices with ShopEase',
};

export const revalidate = 3600; // Revalidate at most every hour

// Loading Components
const HeroLoading = () => (
  <div className="min-h-[60vh] bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <ModernLoader size="lg" text="Loading amazing deals..." />
  </div>
);

const CategoryLoading = () => (
  <section className="py-12 bg-white dark:bg-gray-900">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductsLoading = () => (
  <section className="py-12 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-700 rounded-lg p-4 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default async function Home() {
  // Fetch data in parallel with error handling
  const [banners, categories, featuredProducts] = await Promise.all([
    getActiveBanners().catch(error => {
      console.error('Error fetching banners:', error);
      return [];
    }),
    getCategories().catch(error => {
      console.error('Error fetching categories:', error);
      return [];
    }),
    getFeaturedProducts().catch(error => {
      console.error('Error fetching featured products:', error);
      return [];
    }),
  ]);

  // Simulate a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 100));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Suspense */}
      <Suspense fallback={<HeroLoading />}>
        <HeroSection banners={banners} />
      </Suspense>

      {/* Category Section with Suspense */}
      <Suspense fallback={<CategoryLoading />}>
        <CategorySection categories={categories} />
      </Suspense>

      {/* Featured Products with Suspense */}
      <Suspense fallback={<ProductsLoading />}>
        <FeaturedProducts products={featuredProducts} />
      </Suspense>

      {/* Enhanced Newsletter Section */}
      <section className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 transform rotate-12 scale-150"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stay in the Loop!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Get exclusive access to our latest products, special offers, and insider deals. 
              Join thousands of happy customers who never miss a great deal!
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-6 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-blue-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Assured</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Premium products guaranteed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quick & reliable delivery</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">100% secure checkout</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
