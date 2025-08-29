'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Star, Eye, Truck, Loader, Zap, Award, ShoppingBag } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced image URL generation with fallback
  const getImageUrl = () => {
    if (images && images.length > 0 && !imageError && images[0]) {
      try {
        return urlFor(images[0]).width(400).height(400).quality(85).url();
      } catch (error) {
        console.error('Error generating image URL:', error);
        return '';
      }
    }
    return '';
  };

  const imageUrl = getImageUrl();
  const discountedPrice =
    discount && discount > 0 ? price - (price * discount) / 100 : null;

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

  // Enhanced Grid View
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden border border-gray-100/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50 transform hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Product Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          {imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="relative">
                    <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-8 h-8 border-3 border-purple-500/20 border-b-purple-500 rounded-full animate-spin animate-reverse"></div>
                  </div>
                </div>
              )}
              <Image
                src={imageUrl}
                alt={name}
                fill
                className={`object-cover group-hover:scale-110 transition-all duration-700 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                } ${isHovered ? 'brightness-110' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">No Image Available</span>
              </div>
            </div>
          )}
          
          {/* Enhanced Floating Action Buttons */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-80 translate-x-2'
          }`}>
            <button
              onClick={handleWishlistToggle}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110 ${
                isInWishlist(product._id)
                  ? 'bg-red-500/90 text-white hover:bg-red-600 shadow-red-500/25'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500 shadow-gray-500/25'
              }`}
            >
              <Heart 
                size={18} 
                className={`transition-all duration-300 ${isInWishlist(product._id) ? 'fill-current scale-110' : ''}`} 
              />
            </button>

            <Link href={`/products/${slug.current}`}>
              <button className="p-2.5 rounded-xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-500 transition-all duration-300 shadow-lg hover:scale-110 shadow-gray-500/25">
                <Eye size={18} />
              </button>
            </Link>
          </div>

          {/* Enhanced Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount && discount > 0 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                <Zap size={12} />
                -{discount}%
              </div>
            )}

            {!inStock && (
              <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Out of Stock
              </div>
            )}

            {inStock && discount && discount > 20 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                <Award size={12} className="inline mr-1" />
                Hot Deal
              </div>
            )}
          </div>

          {/* Quick Add to Cart - appears on hover */}
          <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            isHovered && inStock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !inStock}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-6 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm hover:scale-105 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <Link href={`/products/${slug.current}`}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-h-[2.5rem]">
              {name}
            </h3>
          </Link>

          {/* Enhanced Rating Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">(4.2)</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">234 sold</span>
          </div>

          {/* Enhanced Price Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {discountedPrice ? (
                  <>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
              {discountedPrice && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Save {formatPrice(price - discountedPrice)}
                </div>
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

          {/* Enhanced Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || !inStock}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding to Cart...
              </>
            ) : !inStock ? (
              <>
                <ShoppingCart size={16} />
                Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : ''
        }`} />
      </div>
    );
  }

  // Enhanced List View
  return (
    <div 
      className="group bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden border border-gray-100/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {/* Enhanced Product Image */}
        <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-l-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          {imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={imageUrl}
                alt={name}
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          {discount && discount > 0 && (
            <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}

          {!inStock && (
            <div className="absolute bottom-1 left-1 bg-gray-800/90 text-white px-2 py-0.5 rounded-full text-xs font-bold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Enhanced Product Info */}
        <div className="flex-1 p-4 flex flex-col justify-between min-h-[7rem]">
          <div className="space-y-2">
            {/* Product Name */}
            <Link href={`/products/${slug.current}`}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                {name}
              </h3>
            </Link>

            {/* Rating and sold count */}
            <div className="flex items-center gap-2">
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
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">234 sold</span>
            </div>

            {/* Enhanced Price */}
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(price)}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Save {formatPrice(price - discountedPrice)}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                isInWishlist(product._id)
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30'
              }`}
            >
              <Heart 
                size={16} 
                className={`transition-transform duration-200 ${isInWishlist(product._id) ? 'fill-current' : ''}`} 
              />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !inStock}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
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
      </div>
    </div>
  );
};

export default ProductCard;