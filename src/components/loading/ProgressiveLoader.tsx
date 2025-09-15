import React, { useState, useEffect } from "react";
import MovieCardSkeleton from "./MovieCardSkeleton";

interface ProgressiveLoaderProps {
  isLoading: boolean;
  itemCount?: number;
  loadedCount?: number;
  children?: React.ReactNode;
  className?: string;
}

export default function ProgressiveLoader({ 
  isLoading, 
  itemCount = 15, 
  loadedCount = 0,
  children,
  className = ""
}: ProgressiveLoaderProps) {
  const [visibleSkeletons, setVisibleSkeletons] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Gradually show skeleton items
      const interval = setInterval(() => {
        setVisibleSkeletons(prev => {
          if (prev < itemCount) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 100); // Show one skeleton every 100ms

      return () => clearInterval(interval);
    } else {
      setVisibleSkeletons(0);
    }
  }, [isLoading, itemCount]);

  if (!isLoading && children) {
    return <>{children}</>;
  }

  if (!isLoading) {
    return null;
  }

  const progress = loadedCount > 0 ? (loadedCount / itemCount) * 100 : 0;

  return (
    <div className={className}>
      {/* Progress Header */}
      {loadedCount > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              Loading movies...
            </span>
            <span className="text-sm text-blue-600">
              {loadedCount} of {itemCount}
            </span>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Progressive Skeleton Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: Math.min(visibleSkeletons, itemCount) }, (_, index) => (
          <MovieCardSkeleton 
            key={index} 
            delay={index * 50}
          />
        ))}

        {/* Show placeholder spots for remaining items */}
        {Array.from({ length: Math.max(0, itemCount - visibleSkeletons) }, (_, index) => (
          <div 
            key={`placeholder-${index}`}
            className="h-80 bg-gray-50 rounded-lg opacity-30"
            style={{
              animationDelay: `${(visibleSkeletons + index) * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Loading Stats */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">
            {loadedCount > 0 ? (
              `Loaded ${loadedCount} of ${itemCount} movies`
            ) : (
              `Loading ${visibleSkeletons} of ${itemCount} movies...`
            )}
          </span>
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {loadedCount > 0 ? (
          `Loaded ${loadedCount} of ${itemCount} movies`
        ) : (
          "Loading movies progressively. Please wait..."
        )}
      </div>
    </div>
  );
}