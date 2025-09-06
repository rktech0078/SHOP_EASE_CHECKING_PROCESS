'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 'md',
  interactive = false,
  showValue = false,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      setCurrentRating(starRating);
      onRatingChange(starRating);
    }
  };

  const displayRating = interactive ? (hoverRating || currentRating) : rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-colors duration-200 ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            }`}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
