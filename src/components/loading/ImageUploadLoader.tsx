import React from "react";

interface ImageUploadLoaderProps {
  isUploading: boolean;
  progress?: number;
  fileName?: string;
}

export default function ImageUploadLoader({ 
  isUploading, 
  progress = 0, 
  fileName 
}: ImageUploadLoaderProps) {
  if (!isUploading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
      <div className="text-center p-4 w-full max-w-xs">
        {/* Upload Icon with Animation */}
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>

        {/* File Name */}
        {fileName && (
          <p className="text-sm font-medium text-gray-700 mb-2 truncate">
            {fileName}
          </p>
        )}

        {/* Upload Status */}
        <p className="text-green-600 font-medium mb-3">
          Uploading image...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <p className="text-xs text-gray-500">
          {Math.round(progress)}% complete
        </p>

        {/* Loading Animation Dots */}
        <div className="flex justify-center mt-3 space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}