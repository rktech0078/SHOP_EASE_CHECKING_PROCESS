'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Review, ReviewStats } from '@/types';
import ReviewStatsComponent from './ReviewStats';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { Button } from './ui/Button';
import { MessageSquare, Star, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewSectionProps {
  productId: string;
  productName: string;
  className?: string;
}

export default function ReviewSection({ productId, productName, className = '' }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  // Fetch reviews and stats
  const fetchReviews = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/reviews?productId=${productId}`),
        fetch(`/api/reviews/stats?productId=${productId}`)
      ]);

      if (reviewsRes.ok && statsRes.ok) {
        const [reviewsData, statsData] = await Promise.all([
          reviewsRes.json(),
          statsRes.json()
        ]);
        
        setReviews(reviewsData.reviews);
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, fetchReviews]);

  // Handle review submission
  const handleReviewSubmit = async (reviewData: { productId: string; rating: number; title?: string; comment?: string; images?: File[] }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      // Refresh reviews after submission
      await fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  // Handle review vote
  const handleReviewVote = async (reviewId: string, helpful: boolean) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, helpful }),
      });

      if (response.ok) {
        // Update the review in the local state
        setReviews(prev => prev.map(review => {
          if (review._id === reviewId) {
            return {
              ...review,
              helpfulVotes: helpful ? review.helpfulVotes + 1 : review.helpfulVotes,
              notHelpfulVotes: helpful ? review.notHelpfulVotes : review.notHelpfulVotes + 1,
            };
          }
          return review;
        }));
      }
    } catch (error) {
      console.error('Error voting on review:', error);
      toast.error('Failed to vote on review');
    }
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filter === 'all') return true;
      return review.rating === parseInt(filter);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
        case 'oldest':
          return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Reviews
          </h2>
        </div>
        
        {session?.user && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Stats */}
      {stats && <ReviewStatsComponent stats={stats} />}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm
              productId={productId}
              productName={productName}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | '5' | '4' | '3' | '2' | '1')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onVote={handleReviewVote}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to review this product!
            </p>
            {session?.user && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Star className="w-4 h-4" />
                Write the First Review
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button (if needed) */}
      {reviews.length > 10 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
