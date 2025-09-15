"use client";

import React from "react";
import Link from "next/link";
import { BaseErrorBoundary, ErrorBoundaryProps, ErrorFallbackProps } from "./BaseErrorBoundary";

interface APIErrorFallbackProps extends ErrorFallbackProps {
  endpoint?: string;
  method?: string;
  retryable?: boolean;
  statusCode?: number;
}

const APIErrorFallback: React.FC<APIErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary, 
  retry,
  endpoint,
  method = "GET",
  retryable = true,
  statusCode
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const getErrorMessage = () => {
    if (statusCode) {
      switch (Math.floor(statusCode / 100)) {
        case 4:
          if (statusCode === 401) return "Authentication required. Please sign in again.";
          if (statusCode === 403) return "You don't have permission to access this resource.";
          if (statusCode === 404) return "The requested resource was not found.";
          if (statusCode === 429) return "Too many requests. Please wait a moment and try again.";
          return "There was an issue with your request. Please check and try again.";
        case 5:
          return "Server error occurred. Please try again later.";
      }
    }

    if (error.message.includes("network") || error.message.includes("Failed to fetch")) {
      return "Network error. Please check your internet connection and try again.";
    }

    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    return "API request failed. Please try again.";
  };

  const getErrorIcon = () => {
    if (statusCode && statusCode >= 400 && statusCode < 500) {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }

    if (error.message.includes("network")) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5v15m-4.5-7.5h9" />
        </svg>
      );
    }

    return (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const handleRetry = async () => {
    if (retry && !isRetrying) {
      setIsRetrying(true);
      try {
        await retry();
        resetErrorBoundary();
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        // Don't reset, let user try again
      } finally {
        setIsRetrying(false);
      }
    } else {
      resetErrorBoundary();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-6 py-8 min-h-[200px] bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center max-w-md">
        {/* API Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          {getErrorIcon()}
        </div>

        {/* Error Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Error
        </h3>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-4">
          {getErrorMessage()}
        </p>

        {/* API Details */}
        {endpoint && (
          <div className="bg-gray-100 rounded px-3 py-2 mb-4 text-sm">
            <span className="font-medium text-gray-700">{method}</span>
            <span className="text-gray-500 ml-2">{endpoint}</span>
            {statusCode && (
              <span className="ml-2 text-red-600">({statusCode})</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {retryable && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
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
                "Try Again"
              )}
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reload Page
          </button>
        </div>

        {/* Status Code Help */}
        {statusCode === 401 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-left">
            <p className="text-sm text-yellow-800">
              Your session may have expired. Please <Link href="/sign-in" className="underline">sign in again</Link>.
            </p>
          </div>
        )}

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 p-3 bg-white rounded border text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              API Debug Info
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-auto">
              {`Method: ${method}
Endpoint: ${endpoint || 'unknown'}
Status: ${statusCode || 'unknown'}
Retryable: ${retryable}

Error: ${error.message}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface APIErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  endpoint?: string;
  method?: string;
  retryable?: boolean;
  statusCode?: number;
  onRetry?: () => Promise<void>;
}

export const APIErrorBoundary: React.FC<APIErrorBoundaryProps> = ({ 
  children, 
  endpoint,
  method,
  retryable = true,
  statusCode,
  onRetry,
  ...props 
}) => {
  const fallbackComponent = React.useCallback(
    (fallbackProps: ErrorFallbackProps) => (
      <APIErrorFallback
        {...fallbackProps}
        endpoint={endpoint}
        method={method}
        retryable={retryable}
        statusCode={statusCode}
        retry={onRetry}
      />
    ),
    [endpoint, method, retryable, statusCode, onRetry]
  );

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log API-specific error context
    console.error("API Error:", {
      endpoint,
      method,
      statusCode,
      error: error.message,
      retryable,
      errorInfo
    });

    // Call custom error handler if provided
    props.onError?.(error, errorInfo);
  };

  return (
    <BaseErrorBoundary
      {...props}
      fallback={fallbackComponent}
      onError={handleError}
      resetKeys={[endpoint, method, statusCode].filter((key): key is string | number => key != null)}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default APIErrorBoundary;