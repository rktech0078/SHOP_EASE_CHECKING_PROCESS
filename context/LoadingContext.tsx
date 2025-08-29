'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PageLoader } from '@/components/ui/ModernLoader';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
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

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    setLoadingText,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <PageLoader />}
    </LoadingContext.Provider>
  );
};
