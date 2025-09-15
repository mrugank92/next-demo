import React from "react";
import MovieCardSkeleton from "./MovieCardSkeleton";

interface DashboardSkeletonProps {
  count?: number;
}

export default function DashboardSkeleton({ count = 15 }: DashboardSkeletonProps) {
  return (
    <div className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-2">
      <div className="w-full max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" aria-label="Loading page title"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" aria-label="Loading add button"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" aria-label="Loading filter button"></div>
            </div>
          </div>
          
          {/* Search and Filter Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" aria-label="Loading search bar"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" aria-label="Loading filter toggle"></div>
          </div>
        </div>

        {/* Movies Grid Skeleton */}
        <div 
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
          role="status"
          aria-label="Loading movies grid..."
        >
          {Array.from({ length: count }, (_, index) => (
            <MovieCardSkeleton key={index} delay={index * 50} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8" aria-label="Loading pagination">
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-10 w-10 bg-gray-200 rounded animate-pulse"
                aria-label={`Loading page ${index + 1}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Screen reader announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          Loading your movie collection. Please wait...
        </div>
      </div>
    </div>
  );
}