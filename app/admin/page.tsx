'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, Users, DollarSign, TrendingUp, 
  ShoppingCart, Eye, Settings, LogOut,
  ArrowRight, RefreshCw, Calendar, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ModernLoader } from '@/components/ui/ModernLoader';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Check admin authentication
  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
    } else {
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders for stats
      const ordersResponse = await fetch('/api/orders');
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];
        
        // Calculate stats
        const totalRevenue = orders.reduce((acc: number, order: any) => {
          const amount = typeof order.totalAmount === 'number' ? order.totalAmount : 0;
          return order.paymentStatus === 'paid' ? acc + amount : acc;
        }, 0);
        
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
        const completedOrders = orders.filter((o: any) => o.status === 'delivered').length;
        
        // Get unique customers
        const uniqueCustomers = new Set(orders.map((o: any) => o.customer.email)).size;
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          completedOrders,
          totalCustomers: uniqueCustomers,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        });
        
        // Get recent orders
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
    toast.success('Logged out successfully');
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-PK', { 
      style: 'currency', 
      currency: 'PKR' 
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ModernLoader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center">
                <Package size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCustomers}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.averageOrderValue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push('/admin/orders')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Package size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Manage Orders
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  View, update, and track all customer orders
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span>Go to Orders</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push('/products')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <ShoppingCart size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  View Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Browse and manage your product catalog
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <span>Browse Products</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push('/studio')}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Settings size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Content Studio
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Manage products, categories, and content
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                  <span>Open Studio</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h3>
              <button
                onClick={() => router.push('/admin/orders')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Package size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order, index) => (
                <div key={order._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.orderId}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {order.customer.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
