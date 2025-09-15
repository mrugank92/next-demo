"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  retry?: () => Promise<void>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
}

export class BaseErrorBoundary extends Component<ErrorBoundaryProps, State> {
  private resetTimeoutId: number | null = null;
  private previousResetKeys: Array<string | number> = [];

  public state: State = {
    hasError: false,
    errorId: "",
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with context
    const errorContext = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    console.error("BaseErrorBoundary caught an error:", errorContext);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to logging service
    this.reportError(errorContext);
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys) {
        // Check if any reset keys changed
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => this.previousResetKeys[index] !== key
        );
        
        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
        
        this.previousResetKeys = resetKeys;
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  public componentWillUnmount() {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError = async (errorContext: Record<string, unknown>) => {
    try {
      // Only report in production
      if (process.env.NODE_ENV === "production") {
        // Send to logging endpoint
        await fetch("/api/error-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(errorContext),
        });
      }
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
    
    this.setState({ 
      hasError: false, 
      error: undefined,
      errorId: ""
    });
  };

  private resetWithDelay = (delay: number = 1000) => {
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      // Default error UI with enhanced features
      return (
        <div className="flex flex-col justify-center items-center px-6 py-12 min-h-[400px]">
          <div className="text-center max-w-lg">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again or refresh the page.
            </p>

            {/* Error ID for support */}
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Error ID: {this.state.errorId}
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <summary className="cursor-pointer font-medium text-gray-800 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-sm text-red-600 overflow-auto whitespace-pre-wrap max-h-40">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetErrorBoundary}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BaseErrorBoundary;