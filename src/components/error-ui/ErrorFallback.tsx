"use client";

import React from "react";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  retry?: () => Promise<void>;
  title?: string;
  description?: string;
  showErrorDetails?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  retry,
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or refresh the page.",
  showErrorDetails = process.env.NODE_ENV === "development",
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    if (retry && !isRetrying) {
      setIsRetrying(true);
      try {
        await retry();
        resetErrorBoundary();
      } catch (retryError) {
        console.error("Retry failed:", retryError);
      } finally {
        setIsRetrying(false);
      }
    } else {
      resetErrorBoundary();
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-lg">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

        {/* Error Description */}
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Error Details (Development Only) */}
        {showErrorDetails && (
          <details className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-gray-800 mb-2">
              Error Details
            </summary>
            <div className="text-sm text-red-600">
              <p className="font-medium mb-2">{error.name}: {error.message}</p>
              {error.stack && (
                <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {isRetrying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                Retrying...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </>
            )}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload Page
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-6">
          If the problem persists, please contact support or try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorFallback;