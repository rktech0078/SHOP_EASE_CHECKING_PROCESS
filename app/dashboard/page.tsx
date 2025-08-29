'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Order {
  _id: string;
  orderId: string;
  items: Array<{
    product?: {
      _id: string;
      name: string;
      price: number;
      discount?: number;
      images: Array<{ asset: { _ref: string } }>;
    };
    quantity: number;
  }>;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing?: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shipping?: {
    method: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };
  timeline?: Array<{
    status: string;
    timestamp: string;
    description: string;
    location: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch user orders and stats
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserOrders();
    }
  }, [session, fetchUserOrders]);

  // Auto-refresh orders every 30 seconds for real-time updates
  useEffect(() => {
    if (session?.user?.email) {
      const interval = setInterval(() => {
        fetchUserOrders();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [session, fetchUserOrders]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/orders?email=${session?.user?.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
      
      // Calculate stats
      const stats = {
        totalOrders: data.orders?.length || 0,
        totalSpent: data.orders?.reduce((sum: number, order: Order) => {
          // Yeh assume karte hain ke pricing object mein totalAmount property hai, warna 0 use karo
          const pricing: { totalAmount?: number } = order.pricing || {};
          return sum + (pricing.totalAmount ?? 0);
        }, 0) || 0,
        pendingOrders: data.orders?.filter((order: Order) => ['pending', 'processing', 'shipped'].includes(order.status)).length || 0,
        completedOrders: data.orders?.filter((order: Order) => order.status === 'delivered').length || 0
      };
      setUserStats(stats);
      
    } catch (error) {
      toast.error('Error fetching orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
    toast.success('Orders refreshed successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <AlertCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ModernLoader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {session.user.name}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshOrders}
                variant="outline"
                className="flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-8 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Package size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(userStats.totalSpent)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userStats.completedOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <CheckCircle size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <ModernLoader size="lg" text="Loading orders..." />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">#{order.orderId}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(order.pricing?.totalAmount || 0)}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No orders yet</p>
                    <Link href="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Orders</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <ModernLoader size="lg" text="Loading orders..." />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Package size={24} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-gray-100">#{order.orderId}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {formatPrice(order.pricing?.totalAmount || 0)}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {item.product?.name || 'Product Name Unavailable'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                +{order.items.length - 3} more
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Order Timeline Preview */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Timeline</span>
                          </div>
                          {order.timeline && order.timeline.length > 0 ? (
                            <div className="space-y-2">
                              {order.timeline.slice(-3).map((event, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                      {event.status}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                      {new Date(event.timestamp).toLocaleDateString()} • {event.location}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {order.timeline.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 ml-5">
                                  +{order.timeline.length - 3} more updates
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-500 ml-5">
                              No timeline updates yet
                            </p>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.pricing?.subtotal || 0)}</span>
                          </div>
                          {order.pricing?.tax && (
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Tax</span>
                              <span>{formatPrice(order.pricing?.tax)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Shipping</span>
                            <span className={order.pricing?.shipping === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                              {order.pricing?.shipping === 0
                                ? 'Free'
                                : formatPrice(order.pricing?.shipping ?? 0)}
                            </span>
                          </div>
                          {(order.pricing?.discount || 0) > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                              <span>Discount</span>
                              <span>-{formatPrice(order.pricing?.discount ?? 0)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                              <span>Total</span>
                              <span>{formatPrice(order.pricing?.totalAmount || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No orders yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
                  <Link href="/products">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</p>
                      <p className="text-gray-900 dark:text-gray-100">{session.user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                      <p className="text-gray-900 dark:text-gray-100">{session.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</p>
                      <p className="text-gray-900 dark:text-gray-100">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</p>
                      <p className="text-gray-900 dark:text-gray-100">{userStats.totalOrders}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      <ShoppingBag size={16} className="mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full">
                      <Heart size={16} className="mr-2" />
                      My Wishlist
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" className="w-full">
                      <Package size={16} className="mr-2" />
                      Shopping Cart
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Order #{selectedOrder.orderId}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Status</h3>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.product?.name || 'Product Name Unavailable'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Timeline</h3>
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.status}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(event.timestamp).toLocaleString()} • {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Clock size={24} className="mx-auto mb-2" />
                    <p>No timeline updates yet</p>
                  </div>
                )}
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-gray-100">{selectedOrder.customer.fullName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-gray-100">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-500 mt-1" />
                      <div className="text-gray-900 dark:text-gray-100">
                        <p>{selectedOrder.customer.address}</p>
                        <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zipCode}</p>
                        <p>{selectedOrder.customer.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Method</p>
                      <p className="text-gray-900 dark:text-gray-100">{selectedOrder.shipping?.method}</p>
                    </div>
                    {selectedOrder.shipping?.trackingNumber && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tracking Number</p>
                        <p className="text-gray-900 dark:text-gray-100">{selectedOrder.shipping.trackingNumber}</p>
                      </div>
                    )}
                    {selectedOrder.shipping?.estimatedDelivery && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Delivery</p>
                        <p className="text-gray-900 dark:text-gray-100">
                          {new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(selectedOrder.pricing?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(selectedOrder.pricing?.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatPrice(selectedOrder.pricing?.shipping || 0)}</span>
                  </div>
                  {(selectedOrder.pricing?.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">-{formatPrice(selectedOrder.pricing?.discount || 0)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-gray-900 dark:text-gray-100">{formatPrice(selectedOrder.pricing?.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
