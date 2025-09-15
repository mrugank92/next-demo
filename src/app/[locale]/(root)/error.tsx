"use client";

import React from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="fc-page-container">
      <section
        className="fc-main-content"
        aria-labelledby="error-heading"
        role="main"
      >
        <div className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Heading */}
            <h1 id="error-heading" className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong!
            </h1>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              We encountered an error while loading your movies. This might be a
              temporary issue.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <summary className="cursor-pointer font-medium text-gray-800 mb-2">
                  Error Details
                </summary>
                <pre className="text-sm text-red-600 overflow-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-describedby="retry-description"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-describedby="reload-description"
              >
                Reload Page
              </button>
            </div>

            {/* Screen Reader Descriptions */}
            <div className="sr-only">
              <p id="retry-description">
                Retry loading the movies without refreshing the page
              </p>
              <p id="reload-description">
                Reload the entire page to start fresh
              </p>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If the problem persists, please try refreshing the page or contact
              support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}