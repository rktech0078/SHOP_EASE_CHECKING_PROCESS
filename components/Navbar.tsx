'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search, Heart, Home, Package, Grid3X3, Phone, LogOut, Settings, UserCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLoading } from '@/context/LoadingContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { setRouteChanging } = useLoading();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Show loading and navigate to products page with search query
      setRouteChanging(true);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleNavigation = () => {
    setRouteChanging(true);
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" onClick={handleNavigation} className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { href: '/', label: 'Home', icon: Home },
              { href: '/products', label: 'Products', icon: Package },
              { href: '/categories', label: 'Categories', icon: Grid3X3 },
              { href: '/contact', label: 'Contact', icon: Phone }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              >
                <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for products"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  isSearchFocused 
                    ? 'border-blue-500 shadow-lg shadow-blue-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="relative p-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              {wishlistItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {wishlistItemCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu - Hidden on mobile to prevent overlap */}
            {session ? (
              <div className="hidden sm:block relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="hidden sm:block font-medium">{session.user?.name}</span>
                </button>
                
                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.email || 'No email'}
                        </p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings size={16} />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserCheck size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-6 overflow-hidden"
            >
              <div className="space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Search size={16} />
                  </button>
                </form>

                {/* Mobile Navigation */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: '/', label: 'Home', icon: Home },
                    { href: '/products', label: 'Products', icon: Package },
                    { href: '/categories', label: 'Categories', icon: Grid3X3 },
                    { href: '/contact', label: 'Contact', icon: Phone }
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigation}
                      className="flex flex-col items-center gap-2 p-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group border border-gray-100 dark:border-gray-600"
                    >
                      <item.icon size={24} className="group-hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg p-1 transition-all duration-200" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/cart" 
                    onClick={handleNavigation}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-100 dark:border-gray-600"
                  >
                    <ShoppingCart size={20} />
                    <span>Cart ({cartItemCount})</span>
                  </Link>
                  <Link 
                    href="/wishlist" 
                    onClick={handleNavigation}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-100 dark:border-gray-600"
                  >
                    <Heart size={20} />
                    <span>Wishlist ({wishlistItemCount})</span>
                  </Link>
                </div>

                {/* User Actions */}
                {session ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    {/* User Info Header */}
                    <div className="px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {session.user?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {session.user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href="/dashboard" 
                      onClick={handleNavigation}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Settings size={20} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={handleNavigation}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full p-3 text-left text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <Link 
                      href="/auth/signin" 
                      onClick={handleNavigation}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <UserCheck size={20} />
                      <span>Sign In</span>
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <User size={20} />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}