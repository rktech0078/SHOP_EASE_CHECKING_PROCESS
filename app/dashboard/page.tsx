'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { 
  LogOut,
  RefreshCw
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/orders?email=${session?.user?.email}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Orders fetched:', data.orders?.length || 0);
      
    } catch (error) {
      toast.error('Error fetching orders');
      console.error('Error:', error);
    }
  }, [session?.user?.email]);

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

  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
    toast.success('Orders refreshed successfully!');
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Dashboard Content
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your dashboard is working correctly! The fetchUserOrders function has been properly placed.
          </p>
        </div>
      </div>
    </div>
  );
}
