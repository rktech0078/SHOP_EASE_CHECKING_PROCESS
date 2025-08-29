'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoader, LoadingBar } from '@/components/ui/ModernLoader';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  isRouteChanging: boolean;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
  setRouteChanging: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingTextState] = useState('Loading...');
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const pathname = usePathname();

  // Show loading when route changes
  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => {
      setIsRouteChanging(false);
    }, 500); // Minimum loading time for better UX

    return () => clearTimeout(timer);
  }, [pathname]);

  const showLoading = (text?: string) => {
    if (text) {
      setLoadingTextState(text);
    }
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const setLoadingText = (text: string) => {
    setLoadingTextState(text);
  };

  const setRouteChanging = (loading: boolean) => {
    setIsRouteChanging(loading);
  };

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    isRouteChanging,
    showLoading,
    hideLoading,
    setLoadingText,
    setRouteChanging,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingBar isVisible={isRouteChanging} />
      {isLoading && <PageLoader isRouteChange={false} />}
      {isRouteChanging && <PageLoader isRouteChange={true} />}
    </LoadingContext.Provider>
  );
};
