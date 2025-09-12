"use client";

import { useTranslations } from "next-intl";
import React, { useMemo, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const t = useTranslations("Movie");

  // Generate smart pagination with ellipsis
  const pages = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add ellipsis where needed
    let prev = 0;
    for (const i of range) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev !== 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Handlers for previous and next buttons, memoized with useCallback
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <nav
      className="flex flex-col items-center mt-8 sm:mt-12 md:mt-16 lg:mt-20 relative z-10 w-full px-4"
      aria-label="Pagination"
    >
      <ul className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {/* Previous Button */}
        <li>
          <button
            type="button"
            className={`
              fc-button-hover text-white font-semibold 
              px-3 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-l-md 
              transition-all duration-300 transform-gpu origin-center
              min-w-touch-target min-h-touch-target
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                currentPage === 1
                  ? "bg-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-gray-600 cursor-pointer hover:bg-green-500 hover:scale-105 hover:shadow-md"
              }
            `}
            style={{
              fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
            }}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label={`${t("pervious")} page`}
          >
            <span className="hidden sm:inline">{t("pervious")}</span>
            <span className="sm:hidden">‹</span>
          </button>
        </li>

        {/* Page Number Buttons */}
        {pages.map((pageNumber, index) => (
          <li key={`${pageNumber}-${index}`}>
            {pageNumber === "..." ? (
              <span
                className="px-2 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4 mx-1 text-gray-400 flex items-center justify-center min-w-touch-target min-h-touch-target"
                style={{
                  fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                }}
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                className={`
                  fc-button-hover px-2 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4 mx-1 rounded-md 
                  transition-all duration-300 transform-gpu origin-center text-white
                  min-w-touch-target min-h-touch-target
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    currentPage === pageNumber
                      ? "bg-green-500 font-semibold scale-105 shadow-md"
                      : "bg-gray-700 font-medium hover:bg-green-500 hover:scale-105 hover:shadow-md"
                  }
                `}
                style={{
                  fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                }}
                onClick={() => handlePageChange(pageNumber as number)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
                aria-label={`${
                  currentPage === pageNumber ? "Current page, " : ""
                }Page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            className={`
              fc-button-hover body-regular font-semibold 
              px-3 py-3 sm:px-4 sm:py-3 md:px-5 md:py-4 rounded-r-md 
              transition-all duration-300 transform-gpu origin-center text-white
              min-w-touch-target min-h-touch-target
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${
                currentPage === totalPages
                  ? "bg-gray-400 opacity-50 cursor-not-allowed"
                  : "bg-gray-600 cursor-pointer hover:bg-green-500 hover:scale-105 hover:shadow-md"
              }
            `}
            style={{
              fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
            }}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label={`${t("next")} page`}
          >
            <span className="hidden sm:inline text-white">{t("next")}</span>
            <span className="sm:hidden">›</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Pagination);
