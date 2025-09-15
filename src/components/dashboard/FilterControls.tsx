"use client";

interface FilterControlsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;
  onResetFilters: () => void;
}

export default function FilterControls({
  showFilters,
  onToggleFilters,
  activeFiltersCount,
  onResetFilters,
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          showFilters
            ? "bg-green-400 text-white border-2 border-green-500"
            : "bg-green-400 text-white hover:bg-green-300"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
          />
        </svg>
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {activeFiltersCount > 0 && (
        <button
          onClick={onResetFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear all
        </button>
      )}
    </div>
  );
}