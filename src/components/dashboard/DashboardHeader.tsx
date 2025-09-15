"use client";

import { Movie } from "@/types/common";
import { FilterState, FilterActions, FilterMetadata } from "@/hooks/useFilters";
import DashboardTitle from "./DashboardTitle";
import MovieStats from "./MovieStats";
import FilterControls from "./FilterControls";
import UserActions from "./UserActions";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";

interface DashboardHeaderProps {
  movies: Movie[];
  filteredMovies: Movie[];
  filters: FilterState;
  filterActions: FilterActions;
  filterMetadata: FilterMetadata;
  showFilters: boolean;
  onToggleFilters: () => void;
  onResetPageOnFilter: () => void;
}

export default function DashboardHeader({
  movies,
  filteredMovies,
  filters,
  filterActions,
  filterMetadata,
  showFilters,
  onToggleFilters,
  onResetPageOnFilter,
}: DashboardHeaderProps) {
  const handleResetFilters = () => {
    filterActions.resetFilters();
    onResetPageOnFilter();
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <DashboardTitle />
          <MovieStats
            filteredCount={filteredMovies.length}
            totalCount={movies.length}
            genresCount={filterMetadata.availableGenres.length}
            yearsCount={filterMetadata.availableYears.length}
          />
        </div>

        <div className="flex items-center gap-3">
          <FilterControls
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            activeFiltersCount={filterMetadata.activeFiltersCount}
            onResetFilters={handleResetFilters}
          />
          <UserActions />
        </div>
      </div>

      <SearchBar
        searchTerm={filters.searchTerm}
        onSearchChange={filterActions.setSearchTerm}
      />

      <FilterPanel
        filters={filters}
        actions={filterActions}
        metadata={filterMetadata}
        isVisible={showFilters}
      />
    </div>
  );
}