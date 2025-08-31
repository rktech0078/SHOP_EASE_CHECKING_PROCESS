'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Star, Eye, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { name, slug, images, price, discount, inStock } = product;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced image URL generation with fallback
  const getImageUrl = () => {
    if (images && images.length > 0 && !imageError && images[0]) {
      try {
        return urlFor(images[0]).width(500).height(500).quality(90).url();
      } catch (error) {
        console.error('Error generating image URL:', error);
        return '';
      }
    }
    return '';
  };

  const imageUrl = getImageUrl();
  const discountedPrice = discount && discount > 0 ? price - (price * discount) / 100 : null;

  // Enhanced image error handling
  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleAddToCart = async () => {
    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product, 1);
      toast.success('Product added to cart!');
    } catch {
      toast.error('Failed to add product to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist(product);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  // Enhanced Grid View - Mobile First Design
  if (viewMode === 'grid') {
    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700">
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
          {imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={imageUrl}
                alt={name}
                fill
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
              />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          {/* Floating Action Buttons - Mobile Optimized */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 shadow-sm ${
                isInWishlist(product._id)
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart size={16} className={isInWishlist(product._id) ? 'fill-current' : ''} />
            </button>

            <Link href={`/products/${slug.current}`}>
              <button className="p-2 rounded-lg backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm">
                <Eye size={16} />
              </button>
            </Link>
          </div>

          {/* Badges - Mobile Optimized */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discount && discount > 0 && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                -{discount}%
              </div>
            )}

            {!inStock && (
              <div className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Mobile Optimized */}
        <div className="p-3 space-y-2">
          {/* Product Name */}
          <Link href={`/products/${slug.current}`}>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-h-[2.5rem]">
              {name}
            </h3>
          </Link>

          {/* Rating - Simplified for Mobile */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">(4.2)</span>
          </div>

          {/* Price Section - Mobile Optimized */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Free shipping indicator */}
            {price > 1000 && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Truck size={12} />
                Free Shipping
              </div>
            )}
          </div>

          {/* Add to Cart Button - Mobile Optimized */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !inStock}
            className="w-full bg-blue-600 text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : !inStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Enhanced List View - Mobile Optimized
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="flex">
        {/* Product Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800">
          {imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={imageUrl}
                alt={name}
                fill
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 640px) 96px, 112px"
              />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          
          {/* Badges */}
          {discount && discount > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
              -{discount}%
            </div>
          )}

          {!inStock && (
            <div className="absolute bottom-1 left-1 bg-gray-800 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-3 flex flex-col justify-between min-h-[6rem] sm:min-h-[7rem]">
          <div className="space-y-1.5">
            {/* Product Name */}
            <Link href={`/products/${slug.current}`}>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={11} 
                    className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">(4.2)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 rounded transition-all duration-200 hover:scale-110 ${
                isInWishlist(product._id)
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500'
              }`}
            >
              <Heart size={14} className={isInWishlist(product._id) ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !inStock}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : !inStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart size={14} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;