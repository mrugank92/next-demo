"use client";

import { FilterState, FilterActions, FilterMetadata } from "@/hooks/useFilters";

interface FilterPanelProps {
  filters: FilterState;
  actions: FilterActions;
  metadata: FilterMetadata;
  isVisible: boolean;
}

export default function FilterPanel({
  filters,
  actions,
  metadata,
  isVisible,
}: FilterPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            value={filters.selectedGenre}
            onChange={(e) => actions.setSelectedGenre(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genres</option>
            {metadata.availableGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.selectedYear}
            onChange={(e) => actions.setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {metadata.availableYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Rating: {filters.minRating > 0 ? filters.minRating.toFixed(1) : "Any"}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => actions.setMinRating(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Runtime Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Runtime: {filters.maxRuntime > 0 ? `${filters.maxRuntime} min` : "Any"}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            step="15"
            value={filters.maxRuntime}
            onChange={(e) => actions.setMaxRuntime(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}