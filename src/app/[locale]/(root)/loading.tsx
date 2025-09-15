import React from "react";

export default function Loading() {
  return (
    <div className="fc-page-container">
      <section
        className="fc-main-content"
        aria-labelledby="main-heading"
        role="main"
      >
        <div className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-2">
          <div className="w-full max-w-7xl">
            {/* Header Skeleton */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              
              {/* Search and Filter Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Movies Grid Skeleton */}
            <div 
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
              role="status"
              aria-label="Loading movies..."
            >
              {Array.from({ length: 15 }, (_, index) => (
                <div
                  key={index}
                  className="animate-pulse"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
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
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}