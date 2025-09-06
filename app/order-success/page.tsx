'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag,
  Mail,
  Phone,
  Loader
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order details from URL params or localStorage
    const orderId = searchParams.get('orderId');
    const orderData = localStorage.getItem('lastOrder');
    
    console.log('🔍 Order Success Page Debug:');
    console.log('Order ID from URL:', orderId);
    console.log('Order Data from localStorage:', orderData);
    
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData);
        console.log('Parsed Order:', parsedOrder);
        setOrderDetails(parsedOrder);
        // Clear from localStorage after reading
        localStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    } else if (orderId) {
      // If orderId is in URL but no localStorage data, try to fetch from API
      console.log('Order ID found in URL, but no localStorage data');
      // Don't redirect immediately, show a message instead
    } else {
      // No order data found, show a message instead of redirecting
      console.log('No order data found');
    }
    
    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 1500);
  }, [searchParams, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader size={40} className="text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Processing Your Order...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your order details
          </p>
        </div>
      </div>
    );
  }

  // Show message if no order data
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Order Information Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            We couldn&apos;t find your order details. This might happen if you refreshed the page or navigated directly here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <ShoppingBag size={20} className="mr-2" />
                Check Your Orders
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-8 py-3">
                <Home size={20} className="mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Order Details
            </h2>
          </div>

          {orderDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Order ID</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-mono text-lg">{orderDetails.orderId}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Order Status</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    <Package size={14} className="mr-1" />
                    Pending
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Total Amount</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  Rs {orderDetails.totalAmount}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Order details will be available here
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              What Happens Next?
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Order Confirmation</h3>
                <p className="text-gray-600 dark:text-gray-400">You&apos;ll receive an email confirmation with order details</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Order Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">Our team will process and prepare your order</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Shipping & Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400">You&apos;ll get tracking updates via email and SMS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail size={24} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Need Help?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Mail size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@rushk.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Phone size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Phone Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+91 1800-123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <Home size={20} />
              Continue Shopping
            </Button>
          </Link>
          
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2">
              <ShoppingBag size={20} />
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse mx-auto mb-6"></div>
          <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-96 mx-auto"></div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}