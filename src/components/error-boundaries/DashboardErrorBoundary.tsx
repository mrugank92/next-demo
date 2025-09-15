"use client";

import React from "react";
import Link from "next/link";
import { BaseErrorBoundary, ErrorBoundaryProps, ErrorFallbackProps } from "./BaseErrorBoundary";

interface DashboardErrorFallbackProps extends ErrorFallbackProps {
  hasMovies?: boolean;
  filtersActive?: boolean;
}

const DashboardErrorFallback: React.FC<DashboardErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary, 
  hasMovies = false,
  filtersActive = false
}) => {
  const getErrorMessage = () => {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return "Unable to load your movie collection. Please check your connection and try again.";
    }
    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return "Your session has expired. Please sign in again to view your movies.";
    }
    if (error.message.includes("500")) {
      return "Server error while loading your movie collection. Please try again later.";
    }
    
    return "Failed to load your movie dashboard. Please try refreshing the page.";
  };

  const getRecommendedActions = () => {
    const actions = [];
    
    if (error.message.includes("network") || error.message.includes("fetch")) {
      actions.push("Check your internet connection");
      actions.push("Refresh the page");
    } else if (error.message.includes("401")) {
      actions.push("Sign in again");
    } else {
      actions.push("Try refreshing the page");
      actions.push("Clear your browser cache");
    }
    
    if (filtersActive) {
      actions.push("Clear all filters");
    }
    
    return actions;
  };

  const handleClearFilters = () => {
    // Dispatch a custom event to clear filters
    window.dispatchEvent(new CustomEvent('dashboard:clearFilters'));
    resetErrorBoundary();
  };

  return (
    <div className="flex flex-col justify-center items-center px-6 py-16 min-h-[400px]">
      <div className="text-center max-w-lg">
        {/* Dashboard Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Dashboard Error
        </h2>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {/* Recommended Actions */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
          <h3 className="font-medium text-gray-800 mb-2">What you can do:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {getRecommendedActions().map((action, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload Dashboard
          </button>
          
          {filtersActive && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Clear Filters
            </button>
          )}

          {error.message.includes("401") && (
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          )}
        </div>

        {/* Additional Context */}
        {hasMovies && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-left">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Note:</span> Your movies are still safe. This is just a display issue that can be resolved by refreshing the page.
            </p>
          </div>
        )}

        {/* Development Error Details */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-gray-800 mb-2">
              Developer Debug Info
            </summary>
            <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap max-h-40">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface DashboardErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  hasMovies?: boolean;
  filtersActive?: boolean;
}

export const DashboardErrorBoundary: React.FC<DashboardErrorBoundaryProps> = ({ 
  children, 
  hasMovies,
  filtersActive,
  ...props 
}) => {
  const fallbackComponent = React.useCallback(
    (fallbackProps: ErrorFallbackProps) => (
      <DashboardErrorFallback
        {...fallbackProps}
        hasMovies={hasMovies}
        filtersActive={filtersActive}
      />
    ),
    [hasMovies, filtersActive]
  );

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log dashboard-specific error context
    console.error("Dashboard Error:", {
      error: error.message,
      hasMovies,
      filtersActive,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    });

    // Call custom error handler if provided
    props.onError?.(error, errorInfo);
  };

  return (
    <BaseErrorBoundary
      {...props}
      fallback={fallbackComponent}
      onError={handleError}
      resetKeys={[hasMovies?.toString(), filtersActive?.toString()].filter((key): key is string => key != null)}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default DashboardErrorBoundary;