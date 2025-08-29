'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface OrderItem {
  _id: string;
  productId: string | { _ref: string };
  product?: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    images?: Array<{
    asset: {
      _ref: string;
    };
  }>;
  };
  quantity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  customer: Customer;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const username = localStorage.getItem('adminUsername');

    if (!isAuthenticated || !username) {
      router.push('/admin/login');
      return;
    }

    // Check session expiry (30 minutes)
    const sessionTime = localStorage.getItem('adminSessionTime');
    if (sessionTime) {
      const sessionExpiry = new Date(parseInt(sessionTime)).getTime() + (30 * 60 * 1000);
      if (Date.now() > sessionExpiry) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminSessionTime');
        router.push('/admin/login');
        return;
      }
    }

    fetchOrders();
  }, [router]);

  // Auto-refresh orders every 30 seconds for real-time updates
  useEffect(() => {
    if (orders.length > 0) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [orders.length]);

  // Refresh orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Optimistic update function for immediate UI feedback
  const updateOrderStatusOptimistically = (orderId: string, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );

    // Also update selected order if modal is open
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        console.log('📋 Fetched orders:', data.orders);
      } else {
        console.error('❌ Failed to fetch orders:', data.error);
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);

      // Optimistic update - immediately show the new status in UI
      updateOrderStatusOptimistically(orderId, newStatus);

      const response = await fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          description: `Order status updated to ${newStatus}`,
          location: 'Admin Panel'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update with server response data
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? {
                ...order,
                status: newStatus,
                paymentStatus: result.paymentStatus || order.paymentStatus,
                updatedAt: new Date().toISOString()
              }
              : order
          )
        );

        // Update selected order if modal is open
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder(prev => prev ? {
            ...prev,
            status: newStatus,
            paymentStatus: result.paymentStatus || prev.paymentStatus,
            updatedAt: new Date().toISOString()
          } : null);
        }

        toast.success(`Order status updated to ${newStatus}`);
        console.log('✅ Status updated successfully:', { orderId, newStatus, paymentStatus: result.paymentStatus });

      } else {
        // Revert optimistic update on failure
        toast.error(`Failed to update status: ${result.error}`);
        console.error('❌ Status update failed:', result.error);

        // Refresh orders to get correct data from server
        fetchOrders();
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('Failed to update order status');

      // Revert optimistic update on error
      fetchOrders();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminSessionTime');
    router.push('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalRevenue = orders.reduce((acc, order) => {
    const amount = typeof order.totalAmount === 'number' ? order.totalAmount : 0;
    return order.paymentStatus === 'paid' ? acc + amount : acc;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Orders Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Manage all customer orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome,</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                  {localStorage.getItem('adminUsername')}
                </p>
              </div>
              
              {/* Go to Dashboard Button */}
              <Link
                href="/admin"
                className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium hidden sm:block"
              >
                📊 Dashboard
              </Link>
              
              {/* Mobile Dashboard Button */}
              <Link
                href="/admin"
                className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium sm:hidden"
                title="Go to Dashboard"
              >
                📊
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders ({orders.length})
              </h2>
              <button
                onClick={fetchOrders}
                className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400">Orders will appear here once customers place them.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold">#{order.orderId}</h3>
                          <p className="text-blue-100 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Customer Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{order.customer.fullName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer.email}</p>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Items</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{order.items.length} items</span>
                        </div>
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {item.product?.name || `Product ${index + 1}`}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(item.price)} × {item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-500">
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                +{order.items.length - 2} more items
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment & Total */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-gray-600 dark:text-gray-400">Payment:
                            <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Method: {order.paymentMethod.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye size={16} className="inline mr-2" />
                          View Details
                        </button>

                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                          disabled={updatingStatus === order.orderId}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 text-sm transition-all duration-200"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">🔄 Processing</option>
                          <option value="shipped">🚚 Shipped</option>
                          <option value="delivered">✅ Delivered</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>

                      {updatingStatus === order.orderId && (
                        <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mt-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm font-medium">Updating status...</span>
                        </div>
                      )}

                      {/* Status Update Success Indicator */}
                      {order.status !== 'pending' && (
                        <div className="mt-2 text-center">
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Details - #{selectedOrder.orderId}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                      <span className="text-gray-900 dark:text-white">{new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.zipCode}, {selectedOrder.customer.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Product ID: {typeof item.productId === 'string' ? item.productId : item.productId._ref}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(item.price)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total: {formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Status</h4>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.orderId, e.target.value)}
                    disabled={updatingStatus === selectedOrder.orderId}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {updatingStatus === selectedOrder.orderId && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Updating...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
