import React from "react";

export default function EditMovieLoading() {
  return (
    <div className="fc-page-container">
      <section
        className="fc-main-content"
        aria-labelledby="edit-loading-heading"
        role="main"
      >
        <div className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-8">
          <div className="w-full max-w-4xl">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" aria-label="Loading page title"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" aria-label="Loading page description"></div>
            </div>

            {/* Form Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>

                  {/* Overview Field */}
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>

                  {/* Genre Field */}
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>

                  {/* Rating and Runtime */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Release Date and Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    
                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Loading movie details...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}