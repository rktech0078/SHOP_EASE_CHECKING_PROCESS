'use client';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export const ModernLoader = ({ 
  size = 'md', 
  color = 'primary', 
  text = 'Loading...',
  fullScreen = false 
}: ModernLoaderProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-purple-500',
    white: 'border-white'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Spinner */}
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
        />
        
        {/* Loading Text */}
        {text && (
          <div className="text-center animate-fade-in">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {text}
            </p>
            {/* Animated Dots */}
            <div className="flex justify-center space-x-1 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 bg-gray-400 rounded-full animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton Loader for content
export const SkeletonLoader = ({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number; 
  className?: string;
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Page Loader
export const PageLoader = () => (
  <ModernLoader 
    size="lg" 
    text="Loading your experience..." 
    fullScreen={true} 
  />
);

// Card Loader
export const CardLoader = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
    </div>
  </div>
);
