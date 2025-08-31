'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Truck, 
  Shield, 
  CreditCard,
  Lock,
  Package,
  Heart
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
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(productId);
    await new Promise(resolve => setTimeout(resolve, 300));
    updateQuantity(productId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = async (productId: string) => {
    setRemovingItem(productId);
    await new Promise(resolve => setTimeout(resolve, 400));
    removeFromCart(productId);
    setRemovingItem(null);
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ModernLoader size="lg" text="Loading cart..." />
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Aapka cart khali hai
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Abhi tak koi products add nahi kiye hain. Shopping shuru kariye!
          </p>
          
          <div className="space-y-3">
            <Link href="/products">
              <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <ShoppingBag size={20} className="mr-2" />
                Shopping Shuru Kariye
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full py-3 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg">
                <Heart size={20} className="mr-2" />
                Browse Karte Rahiye
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalItems} product{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Cart Header */}
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Cart Items
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {totalItems} product{totalItems !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  </div>
                  
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Clear Cart</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Cart Items List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => {
                  const itemPrice = item.product.discount
                    ? item.product.price - (item.product.price * item.product.discount / 100)
                    : item.product.price;
                  const totalItemPrice = itemPrice * item.quantity;
                  
                  return (
                    <div 
                      key={item.product._id} 
                      className={`p-4 lg:p-6 transition-all duration-300 ${
                        removingItem === item.product._id ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <Image
                                src={urlFor(item.product.images[0] as { asset: { _ref: string } }).url()}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <Package size={24} className="text-gray-400" />
                              </div>
                            )}
                            
                            {/* Discount Badge */}
                            {item.product.discount && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{item.product.discount}%
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                                {item.product.name}
                              </h3>
                              
                              {/* Price Display */}
                              <div className="flex items-center gap-3 mb-3">
                                {item.product.discount ? (
                                  <>
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                      Rs {itemPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      Rs {item.product.price.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    Rs {item.product.price.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {/* Stock Status */}
                              <div className="flex items-center gap-2 mb-4">
                                {item.product.inStock ? (
                                  <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                      In Stock
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-md">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-red-700 dark:text-red-400">
                                      Out of Stock
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={removingItem === item.product._id}
                              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              {removingItem === item.product._id ? (
                                <ModernLoader size="sm" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>

                          {/* Quantity Controls & Total */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quantity:
                              </label>
                              
                              <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <button
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                  disabled={!item.product.inStock || isUpdating === item.product._id}
                                  onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                                >
                                  <Minus size={16} />
                                </button>
                                
                                <div className="px-4 py-2 border-l border-r border-gray-300 dark:border-gray-600 min-w-[3rem] text-center font-semibold">
                                  {isUpdating === item.product._id ? (
                                    <ModernLoader size="sm" />
                                  ) : (
                                    item.quantity
                                  )}
                                </div>
                                
                                <button
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                  disabled={!item.product.inStock || isUpdating === item.product._id}
                                  onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Total Price */}
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Rs {totalItemPrice.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.quantity} × Rs {itemPrice.toFixed(2)}
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

          {/* Order Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CreditCard size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Order Summary
                  </h2>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">Rs {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {tax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                      <span className="font-semibold">Rs {tax.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {shipping === 0 ? 'Free' : `Rs ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400">Discount</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        -Rs {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Rs {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield size={12} className="text-white" />
                    </div>
                    <span className="font-medium">Secure Checkout</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Truck size={12} className="text-white" />
                    </div>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free Shipping' : 'Fast Delivery'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Package size={12} className="text-white" />
                    </div>
                    <span className="font-medium">Easy Returns</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block mb-4">
                  <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                    <Lock size={18} className="mr-2" />
                    Secure Checkout
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <div className="text-center">
                  <Link 
                    href="/products"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    <Heart size={16} />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Rs {totalPrice.toFixed(2)}
              </div>
            </div>
            
            <Link href="/checkout" className="flex-1">
              <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                <Lock size={18} className="mr-2" />
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}