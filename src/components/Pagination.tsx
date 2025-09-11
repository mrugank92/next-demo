"use client";

import { useTranslations } from "next-intl";
import React, { useMemo, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange }) => {
  const t = useTranslations("Movie");

  // Generate smart pagination with ellipsis
  const pages = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
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
        rangeWithDots.push('...');
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
    <nav className="flex flex-col items-center m-28 relative z-10 w-full" aria-label="Pagination">
      <ul className="flex flex-wrap justify-center gap-2">
        {/* Previous Button */}
        <li>
          <button
            type="button"
            className={`text-white font-bold px-4 py-2 rounded-l-md transition-colors duration-200 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#2BD17E]"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label={t("pervious")}
          >
            {t("pervious")}
          </button>
        </li>

        {/* Page Number Buttons */}
        {pages.map((pageNumber, index) => (
          <li key={`${pageNumber}-${index}`}>
            {pageNumber === '...' ? (
              <span className="px-4 py-2 mx-1 text-gray-400">...</span>
            ) : (
              <button
                type="button"
                className={`px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${
                  currentPage === pageNumber
                    ? "bg-primary text-white"
                    : "bg-card text-white hover:bg-[#2BD17E] hover:text-white"
                }`}
                onClick={() => handlePageChange(pageNumber as number)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
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
            className={`body-regular px-4 py-2 rounded-r-md transition-colors duration-200 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#2BD17E]"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label={t("next")}
          >
            {t("next")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Pagination);
