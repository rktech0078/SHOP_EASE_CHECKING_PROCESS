'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';
import { urlFor } from '@/sanity/lib/image';
import { CategoryCardSkeleton } from './ui/skeleton';
import { getCategories } from '@/sanity/lib/api';


interface CategorySectionProps {
  categories: Category[];
}

const CategorySection = ({ categories: initialCategories }: CategorySectionProps) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [isLoading, setIsLoading] = useState(initialCategories?.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have categories from SSR, don't fetch again
    if (initialCategories?.length > 0) {
      setCategories(initialCategories);
      setIsLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        setError(null);
              } catch {
          console.error('Error fetching categories');
          setError('Failed to load categories. Please try again later.');
        } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories]);

  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 animate-fade-in">Shop by Category</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(5)].map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => {
                setIsLoading(true);
                setError(null);
                getCategories()
                  .then(categories => setCategories(categories))
                  .catch(() => setError('Failed to load categories. Please try again later.'))
                  .finally(() => setIsLoading(false));
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 animate-fade-in">No categories available at the moment.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category, index) => {
              const imageUrl = category.image ? urlFor(category.image).url() : '';
              
              return (
                <div key={category._id} className={`animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
                  <Link 
                    href={`/categories/${category.slug.current}`}
                    className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 block"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={index < 4}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">{category.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end p-2 sm:p-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-white">{category.name}</h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;