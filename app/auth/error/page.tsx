'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft, 
  Shield, 
  User, 
  Lock 
} from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorDetails = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return {
          title: 'Server Configuration Error',
          message: 'There is a problem with the server configuration. Please try again later.',
          icon: <Shield size={48} className="text-red-500" />
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          icon: <Lock size={48} className="text-red-500" />
        };
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification link has expired or is invalid.',
          icon: <AlertTriangle size={48} className="text-red-500" />
        };
      case 'Default':
        return {
          title: 'Authentication Error',
          message: 'An unexpected error occurred during authentication.',
          icon: <AlertTriangle size={48} className="text-red-500" />
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'Something went wrong during the authentication process.',
          icon: <AlertTriangle size={48} className="text-red-500" />
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            {errorDetails.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {errorDetails.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {errorDetails.message}
          </p>
        </div>

        {/* Error Code Display */}
        {error && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Code
              </p>
              <p className="text-lg font-mono text-gray-900 dark:text-gray-100">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Troubleshooting Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Check your internet connection</li>
            <li>• Clear your browser cookies and cache</li>
            <li>• Try using a different browser</li>
            <li>• Ensure you're using the correct credentials</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/auth/signin" className="block">
            <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <User size={20} className="mr-2" />
              Try Signing In Again
            </Button>
          </Link>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full py-3">
              <Home size={20} className="mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a 
              href="mailto:support@shopease.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@shopease.com
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 dark:text-gray-400">
              +91 1800-123-4567
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
