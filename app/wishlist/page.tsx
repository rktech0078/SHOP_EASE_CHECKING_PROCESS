'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingCart, Trash2, Eye, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { ModernLoader } from '@/components/ui/ModernLoader';

// Utility function for price formatting
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-PK', { 
    style: 'currency', 
    currency: 'PKR' 
  }).format(price);
};

// Wishlist Item Card Component
const WishlistItem = ({ item, onRemove, onAddToCart }: {
  item: any;
  onRemove: (id: string) => void;
  onAddToCart: (item: any) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(item);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2`}>
          <Link
            href={`/products/${item.slug || item._id}`}
            className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <Eye size={20} className="text-gray-700" />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
          >
            {isLoading ? (
              <ModernLoader size="sm" color="white" />
            ) : (
              <ShoppingCart size={20} />
            )}
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item._id)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(item.price)}
          </span>
          
          {item.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              {item.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Empty Wishlist Component
const EmptyWishlist = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-16 px-4"
  >
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
      <Heart className="text-gray-400" size={48} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Your wishlist is empty
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      Start adding products to your wishlist to save them for later. You can browse our collection and add items you love!
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Package size={20} />
        Browse Products
      </Link>
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowRight size={20} />
        Explore Categories
      </Link>
    </div>
  </motion.div>
);

// Main Wishlist Page
export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id);
    toast.success('Item removed from wishlist');
  };

  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;
    
    setIsClearing(true);
    try {
      clearWishlist();
      toast.success('Wishlist cleared successfully');
    } catch (error) {
      toast.error('Failed to clear wishlist');
    } finally {
      setIsClearing(false);
    }
  };

  const handleAddToCart = async (item: any) => {
    try {
      await addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        images: [item.image],
        inStock: true,
        slug: { current: item._id }
      }, 1);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Heart className="text-red-500" size={32} />
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {wishlistItems.length === 0 
                  ? 'Start building your wishlist' 
                  : `${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} in your wishlist`
                }
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearWishlist}
                  disabled={isClearing}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isClearing ? 'Clearing...' : 'Clear All'}
                </button>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ShoppingCart size={20} />
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Package size={16} />
                    <span>{wishlistItems.length} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ShoppingCart size={16} />
                    <span>Add items to cart</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Value: <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatPrice(wishlistItems.reduce((total, item) => total + item.price, 0))}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <WishlistItem
                    key={item._id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ready to make your wishlist a reality?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add items to your cart and complete your purchase with our secure checkout.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Continue Shopping
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}