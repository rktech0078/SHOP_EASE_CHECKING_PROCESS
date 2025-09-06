'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Review } from '@/types';
import { Button } from '@/components/ui/Button';
import { ModernLoader } from '@/components/ui/ModernLoader';
import { MessageSquare, CheckCircle, XCircle, Reply, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    if ((session?.user as { role?: string })?.role !== 'admin') {
      redirect('/admin/login');
    }
  }, [session]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, status } 
            : review
        ));
        toast.success(`Review ${status}`);
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const handleAdminResponse = async (reviewId: string) => {
    if (!adminResponse.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setResponding(true);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/response`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminResponse: adminResponse.trim() }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, adminResponse: adminResponse.trim() } 
            : review
        ));
        setSelectedReview(null);
        setAdminResponse('');
        toast.success('Response added successfully');
      }
    } catch (error) {
      console.error('Error adding admin response:', error);
      toast.error('Failed to add response');
    } finally {
      setResponding(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ModernLoader size="lg" text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Review Management
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Reviews</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{reviews.filter(r => r.status === 'pending').length}</div>
            <div className="text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{reviews.filter(r => r.status === 'approved').length}</div>
            <div className="text-gray-600 dark:text-gray-400">Approved</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600">{reviews.filter(r => r.status === 'rejected').length}</div>
            <div className="text-gray-600 dark:text-gray-400">Rejected</div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Reviews ({filteredReviews.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {review.user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {review.user.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {review.product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(review._createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(review.status)}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {review.title && (
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.title}
                      </h4>
                    )}
                    
                    {review.comment && (
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                    )}

                    {review.adminResponse && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Admin Response:
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {review.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(review._id, 'approved')}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(review._id, 'rejected')}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      onClick={() => setSelectedReview(review)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Reply className="w-4 h-4" />
                      Respond
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No reviews found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' ? 'No reviews have been submitted yet.' : `No ${filter} reviews found.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Response Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Admin Response
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Review by: {selectedReview.user.fullName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Product: {selectedReview.product.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  &ldquo;{selectedReview.comment}&rdquo;
                </p>
              </div>

              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleAdminResponse(selectedReview._id)}
                  disabled={responding || !adminResponse.trim()}
                  className="flex-1"
                >
                  {responding ? 'Sending...' : 'Send Response'}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedReview(null);
                    setAdminResponse('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
