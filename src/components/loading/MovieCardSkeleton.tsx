import React from "react";

interface MovieCardSkeletonProps {
  delay?: number;
}

export default function MovieCardSkeleton({ delay = 0 }: MovieCardSkeletonProps) {
  return (
    <div
      className="animate-pulse"
      style={{
        animationDelay: `${delay}ms`,
      }}
      role="status"
      aria-label="Loading movie card..."
    >
      {/* Movie Card Skeleton */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Skeleton */}
        <div className="w-full h-64 bg-gray-200"></div>
        
        {/* Content Skeleton */}
        <div className="p-4">
          {/* Title */}
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          
          {/* Description lines */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Rating and year */}
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">Loading movie information...</span>
    </div>
  );
}