'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  DollarSign,
  Package,
  Truck,
  CheckCircle2
} from 'lucide-react';

interface DashboardStatsProps {
  orders: Array<{
    status?: string;
    pricing?: {
      totalAmount?: number;
    };
  }>;
  className?: string;
}

export default function DashboardStats({ orders, className = '' }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    processingOrders: 0,
    shippedOrders: 0
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      const totalSpent = orders.reduce((sum, order) => sum + (order.pricing?.totalAmount || 0), 0);
      const pendingOrders = orders.filter(order => order.status?.toLowerCase() === 'pending').length;
      const deliveredOrders = orders.filter(order => order.status?.toLowerCase() === 'delivered').length;
      const processingOrders = orders.filter(order => order.status?.toLowerCase() === 'processing').length;
      const shippedOrders = orders.filter(order => order.status?.toLowerCase() === 'shipped').length;

      setStats({
        totalOrders: orders.length,
        totalSpent,
        pendingOrders,
        deliveredOrders,
        processingOrders,
        shippedOrders
      });
    }
  }, [orders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900',
      bgColor: 'bg-blue-50 dark:bg-blue-800'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900',
      bgColor: 'bg-green-50 dark:bg-green-800'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900',
      bgColor: 'bg-orange-50 dark:bg-orange-800'
    },
    {
      title: 'Delivered Orders',
      value: stats.deliveredOrders,
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900',
      bgColor: 'bg-emerald-50 dark:bg-emerald-800'
    },
    {
      title: 'Processing Orders',
      value: stats.processingOrders,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900',
      bgColor: 'bg-yellow-50 dark:bg-yellow-800'
    },
    {
      title: 'Shipped Orders',
      value: stats.shippedOrders,
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900',
      bgColor: 'bg-purple-50 dark:bg-purple-800'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
      {statsCards.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
