import React from "react";

interface FormLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export default function FormLoadingOverlay({ 
  isVisible, 
  message = "Processing...", 
  progress 
}: FormLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center p-6">
        {/* Spinner */}
        <div className="relative mb-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          
          {/* Progress circle if progress is provided */}
          {typeof progress === 'number' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Loading Message */}
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        
        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        )}

        {/* Additional info */}
        <p className="text-xs text-gray-500 mt-2">
          Please don&apos;t close this window...
        </p>
      </div>
    </div>
  );
}