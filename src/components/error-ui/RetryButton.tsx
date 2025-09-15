"use client";

import React from "react";

export interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  isRetrying?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  retryDelay?: number;
  showIcon?: boolean;
  className?: string;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isRetrying = false,
  disabled = false,
  variant = "primary",
  size = "md",
  children,
  retryDelay,
  showIcon = true,
  className = "",
}) => {
  const [countdown, setCountdown] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (retryDelay && retryDelay > 0) {
      setCountdown(Math.ceil(retryDelay / 1000));
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [retryDelay]);

  const handleClick = async () => {
    if (countdown !== null || isRetrying || disabled) return;
    
    try {
      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400";
      case "outline":
        return "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-300 disabled:text-gray-400";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-6 py-3 text-base";
      default:
        return "px-4 py-2 text-sm";
    }
  };

  const isDisabled = disabled || isRetrying || countdown !== null;

  const getButtonText = () => {
    if (countdown !== null) {
      return `Retry in ${countdown}s`;
    }
    if (isRetrying) {
      return "Retrying...";
    }
    return children || "Try Again";
  };

  const getIcon = () => {
    if (!showIcon) return null;

    if (isRetrying) {
      return (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
        </svg>
      );
    }

    if (countdown !== null) {
      return (
        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    return (
      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      aria-label={countdown !== null ? `Retry available in ${countdown} seconds` : "Retry operation"}
    >
      {getIcon()}
      {getButtonText()}
    </button>
  );
};

export default RetryButton;