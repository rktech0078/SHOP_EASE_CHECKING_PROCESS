'use client';

import { useState } from 'react';
import { Review } from '@/types';
import StarRating from './StarRating';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: string, helpful: boolean) => void;
  className?: string;
}

export default function ReviewCard({ review, onVote, className = '' }: ReviewCardProps) {
  const [voted, setVoted] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleVote = (helpful: boolean) => {
    if (voted) return; // Prevent multiple votes
    
    setVoted(helpful ? 'helpful' : 'not-helpful');
    if (onVote) {
      onVote(review._id, helpful);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {review.user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.user.fullName}
              </h4>
              {review.verifiedPurchase && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(review._createdAt)}
            </div>
          </div>
        </div>
        
        <StarRating rating={review.rating} size="sm" showValue={false} />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {review.title && (
          <h5 className="font-medium text-gray-900 dark:text-white">
            {review.title}
          </h5>
        )}
        
        {review.comment && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.comment}
          </p>
        )}

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.images.map((image, index) => (
              <div key={index} className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={urlFor(image).width(80).height(80).url()}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Admin Response */}
        {review.adminResponse && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Response from Rushk.pk
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {review.adminResponse}
            </p>
          </div>
        )}
      </div>

      {/* Footer - Helpful Votes */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote(true)}
              disabled={voted !== null}
              className={`flex items-center gap-1 text-sm transition-colors ${
                voted === 'helpful'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpfulVotes})</span>
            </button>
            
            <button
              onClick={() => handleVote(false)}
              disabled={voted !== null}
              className={`flex items-center gap-1 text-sm transition-colors ${
                voted === 'not-helpful'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Not Helpful ({review.notHelpfulVotes})</span>
            </button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {review.status === 'pending' && 'Pending approval'}
          </div>
        </div>
      </div>
    </div>
  );
}
