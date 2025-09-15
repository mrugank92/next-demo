"use client";

import React from "react";
import { BaseErrorBoundary, ErrorBoundaryProps, ErrorFallbackProps } from "./BaseErrorBoundary";

interface FormErrorFallbackProps extends ErrorFallbackProps {
  formType?: string;
  validationErrors?: Record<string, string>;
}

const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary, 
  formType = "form",
  validationErrors
}) => {
  const getErrorMessage = () => {
    if (error.message.includes("validation")) {
      return "Please check your input and try again.";
    }
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Unable to submit the form. Please check your connection and try again.";
    }
    if (error.message.includes("413") || error.message.includes("too large")) {
      return "The file you're trying to upload is too large. Please choose a smaller file.";
    }
    if (error.message.includes("400")) {
      return "There was an issue with your submission. Please review your information.";
    }
    if (error.message.includes("500")) {
      return "Server error occurred while processing your request. Please try again later.";
    }
    
    return `Failed to submit ${formType}. Please try again.`;
  };

  const hasValidationErrors = validationErrors && Object.keys(validationErrors).length > 0;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
      <div className="flex">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          {/* Error Title */}
          <h3 className="text-sm font-medium text-red-800">
            Form Submission Error
          </h3>

          {/* Error Message */}
          <div className="mt-2 text-sm text-red-700">
            <p>{getErrorMessage()}</p>
          </div>

          {/* Validation Errors */}
          {hasValidationErrors && (
            <div className="mt-3">
              <div className="text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">{field}:</span> {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={resetErrorBoundary}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <button
              onClick={() => {
                // Reset form data in parent component
                const form = document.querySelector('form');
                if (form) {
                  form.reset();
                }
                resetErrorBoundary();
              }}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear Form
            </button>
          </div>

          {/* Development Details */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-red-700">
                Development Details
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                Form Type: {formType}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

interface FormErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  formType?: string;
  validationErrors?: Record<string, string>;
  onFormReset?: () => void;
}

export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({ 
  children, 
  formType,
  validationErrors,
  ...props 
}) => {
  const fallbackComponent = React.useCallback(
    (fallbackProps: ErrorFallbackProps) => (
      <FormErrorFallback
        {...fallbackProps}
        formType={formType}
        validationErrors={validationErrors}
      />
    ),
    [formType, validationErrors]
  );

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log form-specific error context
    console.error("Form Error:", {
      formType,
      error: error.message,
      validationErrors,
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
      resetKeys={[formType, JSON.stringify(validationErrors)].filter((key): key is string => key != null)}
    >
      {children}
    </BaseErrorBoundary>
  );
};

export default FormErrorBoundary;