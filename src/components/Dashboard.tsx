"use client";

import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Loading from "./Loading";
import EmptyDashboard from "./EmptyDashboard";
import DashboardHeader from "./dashboard/DashboardHeader";
import MovieGrid from "./dashboard/MovieGrid";
import { useMovies } from "@/hooks/useMovies";
import { useFilters } from "@/hooks/useFilters";
import { usePagination } from "@/hooks/usePagination";
import { useToggle } from "@/hooks/useToggle";
import { Movie } from "@/types/common";

interface DashboardProps {
  initialMovies?: Movie[];
  initialTotalData?: number;
  initialPage?: number;
}

export default function DashBoard({ 
  initialMovies = [], 
  initialTotalData = 0, 
  initialPage = 1
}: DashboardProps) {
  // Core data fetching
  const { movies, totalData, isLoading, isError, error } = useMovies({
    page: initialPage,
    initialData: { movies: initialMovies, totalData: initialTotalData }
  });

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use server-side data during SSR and initial hydration
  const displayMovies = isHydrated ? movies : initialMovies;
  const displayTotalData = isHydrated ? totalData : initialTotalData;

  // Filter management
  const { filters, actions: filterActions, metadata: filterMetadata, filteredMovies } = useFilters(displayMovies);
  
  // Pagination management  
  const { state: paginationState, actions: paginationActions } = usePagination({
    initialPage,
    totalItems: displayTotalData
  });

  // UI state
  const { value: showFilters, toggle: toggleFilters } = useToggle(false);

  // Reset pagination when filters change
  useEffect(() => {
    if (filterMetadata.hasActiveFilters) {
      paginationActions.goToFirstPage();
    }
  }, [filterMetadata.hasActiveFilters, paginationActions]);

  // Loading state
  if (isLoading) {
    return (
      <section
        className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden"
        aria-label="Loading movies"
        role="status"
      >
        <Loading />
        <span className="visually-hidden">
          Loading your movie collection...
        </span>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section
        className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden"
        aria-label="Error loading movies"
        role="alert"
      >
        <p className="text-red-500" id="error-message">
          {error?.message || "Failed to load movies"}
        </p>
        <span className="visually-hidden">
          An error occurred while loading your movies. Please try refreshing the page.
        </span>
      </section>
    );
  }

  // Empty state
  if (!displayMovies.length) {
    return <EmptyDashboard />;
  }

  return (
    <section
      className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-2"
      aria-labelledby="movies-heading"
    >
      <div className="w-full max-w-7xl">
        <DashboardHeader
          movies={displayMovies}
          filteredMovies={filteredMovies}
          filters={filters}
          filterActions={filterActions}
          filterMetadata={filterMetadata}
          showFilters={showFilters}
          onToggleFilters={toggleFilters}
          onResetPageOnFilter={paginationActions.goToFirstPage}
        />

        <MovieGrid movies={filteredMovies} />

        {/* Only show pagination when no filters are active */}
        {!filterMetadata.hasActiveFilters && (
          <nav aria-label="Movie collection pagination">
            <Pagination
              currentPage={paginationState.currentPage}
              totalPages={Math.ceil(displayTotalData / paginationState.pageSize)}
              handlePageChange={paginationActions.setCurrentPage}
            />
          </nav>
        )}
      </div>
    </section>
  );
}