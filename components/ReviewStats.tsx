'use client';

import { ReviewStats as ReviewStatsType } from '@/types';
import StarRating from './StarRating';

interface ReviewStatsProps {
  stats: ReviewStatsType;
  className?: string;
}

export default function ReviewStats({ stats, className = '' }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution, verifiedReviews } = stats;

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Overall Stats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Reviews
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="lg" showValue={false} />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                out of 5
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalReviews}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
              {verifiedReviews > 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {verifiedReviews} verified purchase{verifiedReviews !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Rating Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Rating Distribution
          </h4>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = getPercentage(count);
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {rating}
                    </span>
                    <StarRating rating={1} size="sm" showValue={false} />
                  </div>
                  
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="w-8 text-right">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section - Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalReviews}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Reviews
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {verifiedReviews}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Verified Purchases
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
