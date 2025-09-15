"use client";

import React from "react";
import { BaseErrorBoundary, ErrorBoundaryProps, ErrorFallbackProps } from "./BaseErrorBoundary";

interface MovieErrorFallbackProps extends ErrorFallbackProps {
  movieId?: string;
  operation?: "fetch" | "create" | "update" | "delete";
}

const MovieErrorFallback: React.FC<MovieErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary, 
  movieId,
  operation = "fetch"
}) => {
  const getErrorMessage = () => {
    if (error.message.includes("404") || error.message.includes("not found")) {
      return "The movie you're looking for could not be found.";
    }
    if (error.message.includes("403") || error.message.includes("unauthorized")) {
      return "You don't have permission to perform this action.";
    }
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    
    switch (operation) {
      case "create":
        return "Failed to create the movie. Please try again.";
      case "update":
        return "Failed to update the movie. Please try again.";
      case "delete":
        return "Failed to delete the movie. Please try again.";
      default:
        return "Failed to load movie information. Please try again.";
    }
  };

  const getActionText = () => {
    switch (operation) {
      case "create":
        return "Try Creating Again";
      case "update":
        return "Try Updating Again";
      case "delete":
        return "Try Deleting Again";
      default:
        return "Reload Movie";
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-6 py-8 min-h-[300px] bg-gray-50 rounded-lg">
      <div className="text-center max-w-md">
        {/* Movie Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM5 8v10a2 2 0 002 2h10a2 2 0 002-2V8H5z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Movie Error
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {movieId && (
          <p className="text-sm text-gray-500 mb-4">
            Movie ID: {movieId}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {getActionText()}
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 p-3 bg-white rounded text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Debug Info
            </summary>
            <pre className="text-xs text-red-600 mt-2 overflow-auto">
              Operation: {operation}
              {movieId && `\nMovie ID: ${movieId}`}
              {`\nError: ${error.message}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

interface MovieErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  movieId?: string;
  operation?: "fetch" | "create" | "update" | "delete";
}

export const MovieErrorBoundary: React.FC<MovieErrorBoundaryProps> = ({ 
  children, 
  movieId, 
  operation,
  ...props 
}) => {
  const fallbackComponent = React.useCallback(
    (fallbackProps: ErrorFallbackProps) => (
      <MovieErrorFallback
        {...fallbackProps}
        movieId={movieId}
        operation={operation}
      />
    ),
    [movieId, operation]
  );

  return (
    <BaseErrorBoundary
      {...props}
      fallback={fallbackComponent}
      resetKeys={[movieId, operation].filter((key): key is string => key != null)}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default MovieErrorBoundary;