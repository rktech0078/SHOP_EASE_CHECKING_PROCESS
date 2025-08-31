'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

// Enhanced Page Loader with route change indicator
export const PageLoader = ({ isRouteChange = false }: { isRouteChange?: boolean }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Circle - Base */}
        <div className="w-20 h-20 border-4 border-blue-200 dark:border-gray-700 rounded-full animate-spin"></div>
        {/* Inner Circle - Top Border, Rotates in opposite direction */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
        {/* Middle Circle - Right Border, Rotates in same direction as outer */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-r-purple-600 dark:border-r-purple-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
        {/* Center Circle - Bottom Border, Rotates in opposite direction */}
        <div className="absolute inset-4 w-12 h-12 border-4 border-transparent border-b-green-600 dark:border-b-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {isRouteChange ? 'Navigating...' : 'Loading your experience...'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isRouteChange ? 'Please wait while we take you there' : 'Preparing amazing content for you'}
        </p>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
      </div>

      {/* Animated Dots */}
      <div className="flex justify-center space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
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

// Initial Loader for app startup
export const InitialLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loader after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <span className="text-white font-bold text-4xl">R</span>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Rushk
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your One-Stop Shopping Destination
          </p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative w-16 h-16">
            {/* Outer Circle */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 dark:border-gray-700 rounded-full animate-spin"></div>
            {/* Inner Circle - Rotates in opposite direction */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
            {/* Middle Circle - Rotates in same direction as outer */}
            <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-r-purple-600 dark:border-r-purple-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Preparing your shopping experience...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Loading Wrapper for individual pages
export const LoadingWrapper = ({ 
  children, 
  isLoading, 
  loadingText = "Loading content...",
  fallback = null 
}: { 
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  fallback?: React.ReactNode;
}) => {
  if (isLoading) {
    return fallback || (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ModernLoader size="lg" text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
};

// Loading Bar for top of page navigation
export const LoadingBar = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse">
      <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-loading-bar"></div>
    </div>
  );
};


