"use client";

import React from "react";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = "error",
  dismissible = false,
  onDismiss,
  actions,
  className = "",
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getTypeClasses = () => {
    switch (type) {
      case "error":
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-400",
          title: "text-red-800",
          message: "text-red-700",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "text-yellow-400",
          title: "text-yellow-800",
          message: "text-yellow-700",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "text-blue-400",
          title: "text-blue-800",
          message: "text-blue-700",
        };
      default:
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-400",
          title: "text-red-800",
          message: "text-red-700",
        };
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    const iconClasses = `w-5 h-5 ${getTypeClasses().icon}`;

    switch (type) {
      case "error":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "warning":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "info":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const typeClasses = getTypeClasses();

  return (
    <div className={`border rounded-lg p-4 ${typeClasses.container} ${className}`}>
      <div className="flex">
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}

        {/* Content */}
        <div className={`${showIcon ? "ml-3" : ""} flex-1`}>
          {/* Title */}
          {title && (
            <h3 className={`text-sm font-medium ${typeClasses.title} mb-1`}>
              {title}
            </h3>
          )}

          {/* Message */}
          <div className={`text-sm ${typeClasses.message} ${!title ? "font-medium" : ""}`}>
            {typeof message === "string" ? (
              <p>{message}</p>
            ) : (
              message
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="mt-3">
              {actions}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={handleDismiss}
                className={`inline-flex rounded-md p-1.5 ${typeClasses.icon} hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current`}
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;