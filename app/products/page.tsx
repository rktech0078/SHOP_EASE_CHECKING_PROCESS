'use client';

import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '@/sanity/lib/api';
import ProductCard from '@/components/ProductCard';
import { Category, Product } from '@/types';
import { Search, SlidersHorizontal, Grid3X3, List, Filter, SortAsc, SortDesc, X, Sparkles, TrendingUp, Star, Package, Zap, RefreshCw } from 'lucide-react';
import { ModernLoader, LoadingWrapper } from '@/components/ui/ModernLoader';

export const dynamic = 'force-dynamic';



export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  
  useEffect(() => {
    // Get URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    setCategory(categoryParam);
    if (searchParam) setSearch(searchParam);
    
    // Fetch data
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products based on category and search query
  const filteredProducts = products
    .filter((product) => {
      // Filter by category if provided
      if (category && category !== 'all') {
        // Check if product.categories exists and is an array
        if (product.categories && Array.isArray(product.categories)) {
          return product.categories.some((cat) => cat && cat._ref === category);
        }
        return false; // No categories found
      }
      return true;
    })
    .filter((product) => {
      // Filter by search query if provided
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      }
      return true;
    });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b._createdAt || 0).getTime() - new Date(a._createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic is already handled by the filter
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory(null);
    setQuickFilters([]);
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'price-low': return <SortAsc className="w-4 h-4" />;
      case 'price-high': return <SortDesc className="w-4 h-4" />;
      case 'name': return <SortAsc className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getProductStats = () => {
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.inStock).length;
    const averagePrice = products.length > 0 ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0;
    
    return { totalProducts, inStockProducts, averagePrice };
  };

  const stats = getProductStats();

  return (
    <LoadingWrapper isLoading={loading} loadingText="Loading amazing products...">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Header Section */}
      <div className="relative bg-white dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-900 dark:to-purple-950/20"></div>
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400">
                  All Products
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                Discover amazing products at <span className="text-green-600 font-semibold">great prices</span>
              </p>

              {/* Enhanced Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">{stats.totalProducts} Products</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-sm">
                  <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-300">{stats.inStockProducts} In Stock</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-purple-800 dark:text-purple-300">Avg ${Math.round(stats.averagePrice)}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="w-full lg:w-96">
              <form onSubmit={handleSearch} className="relative group">
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'scale-105' : ''
                }`}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full p-4 pl-12 pr-24 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search size={20} className={`transition-colors ${
                      isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl text-sm px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                  >
                    Search
                  </button>
                </div>
                
                {/* Search suggestions/recent searches could go here */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50">
                    <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                      Popular searches: Electronics, Fashion, Home & Garden
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className={`bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-24 transition-all duration-300 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Filter size={16} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Active Filters */}
              {(category || search || quickFilters.length > 0) && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">Active Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        Search: &quot;{search}&quot;
                        <button onClick={() => setSearch('')}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {category && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                        {categories.find(c => c._id === category)?.name}
                        <button onClick={() => setCategory(null)}>
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                      !category 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="font-medium">All Categories</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      !category ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    }`}>
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat: Category) => {
                    const categoryCount = products.filter(p => 
                      p.categories && Array.isArray(p.categories) && 
                      p.categories.some(c => c._ref === cat._id)
                    ).length;
                    
                    return (
                      <button
                        key={cat._id}
                        onClick={() => setCategory(cat._id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                          category === cat._id 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          category === cat._id ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                        }`}>
                          {categoryCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Sort Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  {getSortIcon()}
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'name' | 'price-low' | 'price-high')}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                >
                  <option value="newest">✨ Newest First</option>
                  <option value="name">📝 Name A-Z</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                </select>
              </div>

              {/* Enhanced Results Count */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sortedProducts.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Products Found</div>
                  {sortedProducts.length !== products.length && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      of {products.length} total
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Products Section */}
          <div className="w-full lg:w-3/4">
            {/* Enhanced Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Grid3X3 size={18} />
                    <span className="hidden sm:inline text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <List size={18} />
                    <span className="hidden sm:inline text-sm font-medium">List</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Showing</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{sortedProducts.length}</span>
                  <span>results</span>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm font-medium"
              >
                <SlidersHorizontal size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <div className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                  {(category ? 1 : 0) + (search ? 1 : 0)}
                </div>
              </button>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <ModernLoader size="lg" text="Loading amazing products..." />
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Discovering the best deals for you</p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {sortedProducts.map((product, index) => (
                      <div 
                        key={product._id} 
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProductCard product={product} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedProducts.map((product, index) => (
                      <div 
                        key={product._id} 
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <ProductCard product={product} viewMode="list" />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More Button - Optional Enhancement */}
                {sortedProducts.length > 20 && (
                  <div className="text-center mt-12">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                  We couldn&apos;t find any products matching your criteria. Try adjusting your filters or browse all products.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                  >
                    View All Products
                  </button>
                  <button
                    onClick={() => setSearch('')}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        .bg-grid-gray-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .bg-grid-gray-800\\/50 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
      `}</style>
      </div>
    </LoadingWrapper>
  );
}