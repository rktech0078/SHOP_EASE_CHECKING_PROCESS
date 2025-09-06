'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { 
  LogOut,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Edit,
  Eye,
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import OrderTrackingCard from '@/components/OrderTrackingCard';
import DashboardStats from '@/components/DashboardStats';

interface OrderItem {
  _id: string;
  productId: string;
  productName?: string;
  selectedSize?: string;
  selectedColor?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    images: Array<{
      asset: {
        _ref: string;
      };
    }>;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing: {
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
  shipping: {
    method: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    actualDelivery: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
    location: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  addresses: Array<{
    isDefault: boolean;
    label: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    landmark: string;
    addressType: string;
  }>;
  createdAt: string;
  lastLogin: string;
}

// Helper function to safely render images
const SafeImage = ({ image, alt, width, height, className }: {
  image: {
    asset?: {
      _ref: string;
    };
  } | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  if (!image?.asset?._ref || image.asset._ref === '') {
    return null;
  }

  try {
    return (
      <Image
        src={urlFor(image).url()}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  } catch (error) {
    console.error('Error rendering image:', error);
    return null;
  }
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/orders?email=${session?.user?.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
      console.log('Orders fetched:', data.orders?.length || 0);
      
    } catch (error) {
      toast.error('Error fetching orders');
      console.error('Error:', error);
    }
  }, [session?.user?.email]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setUserProfile(data.user);
      
    } catch (error) {
      toast.error('Error fetching profile');
      console.error('Error:', error);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    if (session?.user?.email) {
      Promise.all([fetchUserOrders(), fetchUserProfile()]).finally(() => {
        setLoading(false);
      });
    }
  }, [session, fetchUserOrders, fetchUserProfile]);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (session?.user?.email) {
      const interval = setInterval(() => {
        fetchUserOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session, fetchUserOrders]);

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserOrders(), fetchUserProfile()]);
    setRefreshing(false);
    toast.success('Dashboard refreshed successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'processing': return <Package size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'cancelled': return <LogOut size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ModernLoader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                My Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {session.user.name}! 👋
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
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

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4">
          <nav className="flex space-x-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <ShoppingBag size={18} /> },
              { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
              { id: 'profile', label: 'Profile', icon: <User size={18} /> },
              { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <ShoppingBag size={20} /> },
              { id: 'orders', label: 'Orders', icon: <Package size={20} /> },
              { id: 'profile', label: 'Profile', icon: <User size={20} /> },
              { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats orders={orders} />

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h3>
              </div>
              <div className="p-4 lg:p-6">
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <div className="flex-shrink-0">
                            {order.items[0]?.product?.images?.[0]?.asset?._ref && (
                              <SafeImage
                                image={order.items[0].product.images[0]}
                                alt={order.items[0].product.name || 'Product Image'}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              Order #{order.orderId}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </span>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(order.pricing.totalAmount)}
                          </p>
                          <Button
                            onClick={() => setActiveTab('orders')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye size={16} />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Start shopping to see your orders here.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => router.push('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order History</h3>
              </div>
              <div className="p-4 lg:p-6">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <OrderTrackingCard 
                        key={order._id} 
                        order={order}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Start shopping to see your orders here.
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => router.push('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Information</h3>
              </div>
              <div className="p-4 lg:p-6">
                {userProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userProfile.fullName}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={userProfile.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={userProfile.phone}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          defaultValue={userProfile.role}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(userProfile.createdAt)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {userProfile.lastLogin ? formatDate(userProfile.lastLogin) : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center gap-2">
                        <Edit size={16} />
                        Update Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Profile not found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Unable to load your profile information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Saved Addresses</h3>
              </div>
              <div className="p-4 lg:p-6">
                {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProfile.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p className="font-medium">{address.fullName}</p>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          {address.landmark && <p>Landmark: {address.landmark}</p>}
                          <p>Phone: {address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No addresses saved</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add your first address to get started.
                    </p>
                    <div className="mt-6">
                      <Button>
                        Add New Address
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
