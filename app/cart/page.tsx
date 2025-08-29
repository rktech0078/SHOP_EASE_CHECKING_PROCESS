'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Shield, 
  CreditCard,
  Lock,
  Package,
  CheckCircle,
  Heart,
  Star,
  Gift,
  Zap,
  Timer,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalItems, 
    totalPrice, 
    subtotal, 
    tax, 
    shipping, 
    discount 
  } = useCart();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    setIsUpdating(productId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    updateQuantity(productId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = async (productId: string) => {
    setRemovingItem(productId);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    removeFromCart(productId);
    setRemovingItem(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <div className="relative mb-8">
            {/* Animated Shopping Bag */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-6 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
              <ShoppingBag size={64} className="text-white animate-pulse" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 mb-4 animate-fade-in">
            Aapka cart khali hai!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed animate-fade-in animation-delay-200">
            Abhi tak koi products add nahi kiye hain. Shopping shuru kariye aur amazing products discover kariye!
          </p>
          
          <div className="space-y-4">
            <Link href="/products" className="block group">
              <Button className="w-full py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                <div className="flex items-center justify-center gap-3">
                  <Zap size={24} className="group-hover:animate-bounce" />
                  <span>Shopping Shuru Kariye</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Button>
            </Link>
            
            <Link href="/" className="block group">
              <Button variant="outline" className="w-full py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-300">
                <div className="flex items-center justify-center gap-3">
                  <Heart size={20} className="group-hover:text-red-500 transition-colors" />
                  <span>Browse Karte Rahiye</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110"
        >
          {showMobileSummary ? <X size={24} /> : <CreditCard size={24} />}
        </button>
      </div>

      {/* Mobile Order Summary Overlay */}
      {showMobileSummary && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6 transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-800 dark:from-gray-100 dark:to-green-300">
                Order Summary
              </h2>
              <button
                onClick={() => setShowMobileSummary(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Mobile Price Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
              </div>
              
              {tax > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Tax (10%)</span>
                  <span className="font-bold text-lg">{formatPrice(tax)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Shipping</span>
                <span className="font-bold text-lg">{formatPrice(shipping)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <span className="text-green-600 dark:text-green-400 font-medium">Discount</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile Checkout Button */}
            <Button className="w-full py-4 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-center gap-3">
                <Lock size={20} />
                <span>Checkout Karo</span>
                <ArrowRight size={20} />
              </div>
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 mb-6 animate-fade-in">
            Shopping Cart
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Aapke selected products ka collection. Review karein aur secure checkout karein!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Cart Header */}
              <div className="p-6 md:p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <ShoppingBag size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 dark:from-gray-100 dark:to-blue-300">
                        Cart Items
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{totalItems} products selected</p>
                    </div>
                  </div>
                  
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="hidden md:flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
                    >
                      <Trash2 size={18} />
                      <span className="font-medium">Clear Cart</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {cartItems.map((item, index) => {
                  const itemPrice = item.product.discount
                    ? item.product.price - (item.product.price * item.product.discount / 100)
                    : item.product.price;
                  const totalItemPrice = itemPrice * item.quantity;
                  
                  return (
                    <div 
                      key={item.product._id} 
                      className={`p-6 transform transition-all duration-500 hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 ${
                        removingItem === item.product._id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-6">
                        {/* Enhanced Product Image */}
                        <div className="relative group">
                          <div className="relative w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-all duration-300">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={urlFor(item.product.images[0] as { asset: { _ref: string } }).url()}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                                <span className="text-gray-400 text-xs font-medium">No image</span>
                              </div>
                            )}
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                <Star size={16} className="text-yellow-500" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Discount Badge */}
                          {item.product.discount && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-2 py-1 rounded-full shadow-lg animate-pulse">
                              -{item.product.discount}%
                            </div>
                          )}
                        </div>

                        {/* Enhanced Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {item.product.name}
                              </h3>
                              
                              {/* Enhanced Price Display */}
                              <div className="flex items-center gap-4 mb-4">
                                {item.product.discount ? (
                                  <>
                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                                      {formatPrice(itemPrice)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through font-medium">
                                      {formatPrice(item.product.price)}
                                    </span>
                                    <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 text-red-800 dark:text-red-300 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                                      <Gift size={12} className="inline mr-1" />
                                      {item.product.discount}% SAVE
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 dark:from-gray-100 dark:to-blue-300">
                                    {formatPrice(item.product.price)}
                                  </span>
                                )}
                              </div>

                              {/* Enhanced Stock Status */}
                              <div className="flex items-center gap-3 mb-6">
                                {item.product.inStock ? (
                                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">Stock mein hai</span>
                                    <CheckCircle size={14} className="text-green-600" />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">Stock khatam</span>
                                    <Timer size={14} className="text-red-600" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Enhanced Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={removingItem === item.product._id}
                              className="group p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
                            >
                              {removingItem === item.product._id ? (
                                <ModernLoader size="sm" />
                              ) : (
                                <Trash2 size={22} className="group-hover:animate-bounce" />
                              )}
                            </button>
                          </div>

                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Package size={16} />
                                Quantity:
                              </label>
                              
                              <div className="flex items-center bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                                <button
                                  className="group p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 transition-all duration-300 hover:scale-110"
                                  disabled={!item.product.inStock || isUpdating === item.product._id}
                                  onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                                >
                                  <Minus size={18} className="group-hover:text-blue-600" />
                                </button>
                                
                                <div className="px-6 py-3 border-l border-r border-gray-200 dark:border-gray-600 min-w-[4rem] text-center font-bold text-lg bg-gradient-to-b from-gray-50 to-white dark:from-gray-600 dark:to-gray-700">
                                  {isUpdating === item.product._id ? (
                                    <ModernLoader size="sm" />
                                  ) : (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                      {item.quantity}
                                    </span>
                                  )}
                                </div>
                                
                                <button
                                  className="group p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 transition-all duration-300 hover:scale-110"
                                  disabled={!item.product.inStock || isUpdating === item.product._id}
                                  onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                                >
                                  <Plus size={18} className="group-hover:text-blue-600" />
                                </button>
                              </div>
                            </div>

                            {/* Enhanced Total Price */}
                            <div className="text-right">
                              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                                {formatPrice(totalItemPrice)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {item.quantity} × {formatPrice(itemPrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-32">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CreditCard size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-800 dark:from-gray-100 dark:to-green-300">
                    Order Summary
                  </h2>
                </div>

                {/* Enhanced Price Breakdown */}
                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                      <Package size={16} />
                      Subtotal ({totalItems} items)
                    </span>
                    <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {tax > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Tax (10%)</span>
                      <span className="font-bold text-lg">{formatPrice(tax)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                      <Truck size={16} />
                      Shipping
                    </span>
                    <span className={`font-bold text-lg ${shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {shipping === 0 ? (
                        <span className="flex items-center gap-1">
                          <Gift size={16} />
                          Free!
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
                      <span className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                        <Gift size={16} />
                        Discount
                      </span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-5">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl shadow-lg">
                      <span className="text-xl font-black text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Trust Badges */}
                <div className="space-y-4 mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Shield size={16} className="text-white" />
                    </div>
                    <span className="font-semibold">100% Secure Checkout</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                      <Truck size={16} className="text-white" />
                    </div>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">✨ Free Shipping (Rs. 1000+ orders)</span>
                      ) : (
                        <span>Shipping: Rs. 200 (Free Rs. 1000+ par)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <Package size={16} className="text-white" />
                    </div>
                    <span className="font-semibold">Easy Returns & Exchanges</span>
                  </div>
                </div>

                {/* Enhanced Shipping Progress Bar */}
                {shipping > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <Zap size={16} />
                        Free Shipping Progress
                      </span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Rs. {1000 - subtotal} aur chahiye
                      </span>
                    </div>
                    
                    <div className="relative w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {subtotal >= 1000 ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle size={14} />
                          🎉 Mubarak! Free shipping mil gaya!
                        </span>
                      ) : (
                        'Aur items add kariye free shipping ke liye!'
                      )}
                    </p>
                  </div>
                )}

                {/* Enhanced Checkout Button */}
                <Link href="/checkout" className="block group mb-4">
                  <Button className="w-full py-5 text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-300 rounded-2xl relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="flex items-center justify-center gap-4 relative z-10">
                      <Lock size={24} className="group-hover:animate-bounce" />
                      <span>Secure Checkout</span>
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Button>
                </Link>

                {/* Enhanced Continue Shopping */}
                <div className="text-center">
                  <Link 
                    href="/products"
                    className="group inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-bold transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Heart size={18} className="group-hover:text-red-500 transition-colors" />
                    <span>Aur Shopping Kariye</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Enhanced Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total</div>
              <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {formatPrice(totalPrice)}
              </div>
            </div>
            
            <Link href="/checkout" className="flex-1">
              <Button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold rounded-2xl shadow-lg transform active:scale-95 transition-all duration-200">
                <div className="flex items-center justify-center gap-2">
                  <Lock size={20} />
                  <span>Checkout</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-move 3s ease infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Enhanced hover effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Glassmorphism effect */
        .glass {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-dark {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Mobile responsiveness enhancements */
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
          
          .text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          
          .p-6 {
            padding: 1rem;
          }
          
          .gap-6 {
            gap: 1rem;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced focus states for accessibility */
        button:focus,
        a:focus {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }
        
        /* Loading animation enhancement */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}