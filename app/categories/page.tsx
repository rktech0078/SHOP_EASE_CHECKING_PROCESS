import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCategories } from '@/sanity/lib/api';
import { urlFor } from '@/sanity/lib/image';
import { CategoryCardSkeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Categories - ShopEase',
  description: 'Browse all product categories at ShopEase',
};

export const revalidate = 3600; // Revalidate at most every hour

export default async function CategoriesPage() {
  // Fetch categories with error handling
  const categories = await getCategories().catch(error => {
    console.error('Error fetching categories:', error);
    return [];
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[30vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90">
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Product Categories</h1>
            <p className="text-lg md:text-xl text-white/90">
              Explore our wide range of product categories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const imageUrl = category.image ? urlFor(category.image).url() : '';
                const animationDelay = `${(index % 6) + 1}00`;
                
                return (
                  <Link 
                    href={`/categories/${category.slug?.current || category._id}`} 
                    key={category._id}
                    className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-${animationDelay}`}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {imageUrl ? (
                        <>
                          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <Image 
                            src={imageUrl} 
                            alt={category.name} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </>
                      ) : (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center">
                        <span>Browse Products</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* No Categories Message */}
          {categories.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please check back later as we update our catalog.
              </p>
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}