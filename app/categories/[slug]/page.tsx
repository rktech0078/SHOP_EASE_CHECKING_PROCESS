import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, getProductsByCategory } from '@/sanity/lib/api';
import { urlFor } from '@/sanity/lib/image';


interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found - Rushk',
      description: 'The requested category could not be found',
    };
  }

  return {
    title: `${category.name} - Rushk`,
description: category.description || `Browse ${category.name} products at Rushk`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category._id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        {category.image ? (
          <Image 
            src={urlFor(category.image).url()} 
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"></div>
        )}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg md:text-xl text-white/90">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto max-w-6xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400">
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
          </nav>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name} Products
            </h2>
            <span className="text-gray-600 dark:text-gray-400">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                No products are available in this category yet.
              </p>
              <Link 
                href="/categories"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const imageUrl = product.images && product.images[0] ? urlFor(product.images[0]).url() : '';
                const animationDelay = `${(index % 8) + 1}00`;
                
                return (
                  <Link 
                    href={`/products/${product.slug?.current || product._id}`} 
                    key={product._id}
                    className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-${animationDelay}`}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {imageUrl ? (
                        <>
                          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <Image 
                            src={imageUrl} 
                            alt={product.name} 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            fill
                          />
                        </>
                      ) : (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${product.price}
                        </span>
                        <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                          <span className="text-sm">View</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
