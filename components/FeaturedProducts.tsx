'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './ui/skeleton';
import { getFeaturedProducts } from '@/sanity/lib/api';
import Link from 'next/link';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(initialProducts?.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProducts?.length > 0) {
      setProducts(initialProducts);
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await getFeaturedProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white relative">
            Featured Products
            <span className="absolute left-0 -bottom-1 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </h2>
          <Link
            href="/products"
            className="text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full shadow hover:opacity-90 transition"
          >
            View All
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white/50 dark:bg-black/20 rounded-xl shadow-sm backdrop-blur-md">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                getFeaturedProducts()
                  .then(products => setProducts(products))
                  .catch(() => setError('Failed to load featured products. Please try again later.'))
                  .finally(() => setIsLoading(false));
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8 animate-fade-in">
            No featured products available at the moment.
          </p>
        ) : (
          <>
            {/* Mobile Slider */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[75%] xs:w-[60%] sm:w-[45%] snap-start transform transition duration-300 hover:-translate-y-2 hover:shadow-lg rounded-xl"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="transform transition duration-300 hover:-translate-y-2 hover:shadow-lg rounded-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
