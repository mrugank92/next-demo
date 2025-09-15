"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  public componentWillUnmount() {
    if (this.retryTimeoutId) {
      window.clearTimeout(this.retryTimeoutId);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleRetryWithDelay = (delay: number = 1000) => {
    this.retryTimeoutId = window.setTimeout(() => {
      this.handleRetry();
    }, delay);
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <summary className="cursor-pointer font-medium text-gray-800 mb-2">
                  Error Details
                </summary>
                <pre className="text-sm text-red-600 overflow-auto whitespace-pre-wrap">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-describedby="retry-description"
              >
                Try Again
              </button>
              
              <button
                onClick={() => this.handleRetryWithDelay(500)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-describedby="retry-delay-description"
              >
                Retry in a moment
              </button>
            </div>

            {/* Screen Reader Descriptions */}
            <div className="sr-only">
              <p id="retry-description">
                Retry the operation that caused the error
              </p>
              <p id="retry-delay-description">
                Retry the operation after a short delay
              </p>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-6">
              If the problem persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}