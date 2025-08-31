'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search, Heart, Home, Package, Grid3X3, Phone, LogOut, Settings, UserCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLoading } from '@/context/LoadingContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { setRouteChanging } = useLoading();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      setRouteChanging(true);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleNavigation = () => {
    setRouteChanging(true);
    handleMenuClose();
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      handleMenuClose();
    } else {
      handleMenuOpen();
    }
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    setIsOpening(true);
    setIsClosing(false);
    
    // Remove opening state after animation completes
    setTimeout(() => {
      setIsOpening(false);
    }, 400);
  };

  const handleMenuClose = () => {
    setIsClosing(true);
    setIsOpening(false);
    
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm border-b border-gray-200' : 'bg-white'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" onClick={handleNavigation} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Rushk</span>
          </Link>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-2">
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Heart size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Menu Button */}
            <button
              onClick={handleMenuToggle}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu - For all screen sizes */}
        {(isMenuOpen || isClosing) && (
          <div 
            className={`border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
              isClosing 
                ? 'max-h-0 py-0 opacity-0 transform -translate-y-4' 
                : isOpening
                ? 'max-h-0 py-0 opacity-0 transform -translate-y-4'
                : 'max-h-[800px] py-4 opacity-100 transform translate-y-0'
            }`}
          >
            <div className="space-y-4">
              {/* Mobile Search - Only show on small screens */}
              <form onSubmit={handleSearch} className="md:hidden relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Search size={14} />
                </button>
              </form>

              {/* Navigation Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    className="flex flex-col items-center gap-2 p-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/cart" 
                  onClick={handleNavigation}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                >
                  <ShoppingCart size={18} />
                  <span>Cart ({cartItemCount})</span>
                </Link>
                <Link 
                  href="/wishlist" 
                  onClick={handleNavigation}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                >
                  <Heart size={18} />
                  <span>Wishlist ({wishlistItemCount})</span>
                </Link>
              </div>

              {/* User Actions */}
              {session ? (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {/* User Info Header */}
                  <div className="px-3 py-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.user?.email || 'No email'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    onClick={handleNavigation}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Settings size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      handleMenuClose();
                    }}
                    className="flex items-center gap-3 w-full p-3 text-left text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Link 
                    href="/auth/signin" 
                    onClick={handleNavigation}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <UserCheck size={18} />
                    <span>Sign In</span>
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    onClick={handleMenuClose}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <User size={18} />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}