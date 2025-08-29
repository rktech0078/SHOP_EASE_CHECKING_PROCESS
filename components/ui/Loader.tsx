'use client';

import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

export function Loader({ size = 'medium', fullScreen = false, text = 'Loading...' }: LoaderProps) {
  // Size configurations
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Glass effect card */}
        <div className="absolute inset-0 -m-4 rounded-xl bg-white/10 backdrop-blur-md shadow-xl z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 space-y-3">
          <div className={`${sizeClasses[size]} rounded-full border-t-transparent border-primary animate-spin`}></div>
          {text && <p className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">{text}</p>}
        </div>
      </div>
    </div>
  );
}