"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useFilters } from "@/hooks/useFilters";
import { Movie } from "@/types/common";

interface MovieFilterableListContextValue {
  movies: Movie[];
  filteredMovies: Movie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

const MovieFilterableListContext = createContext<MovieFilterableListContextValue | undefined>(undefined);

interface MovieFilterableListProps {
  movies: Movie[];
  children: ReactNode;
}

function MovieFilterableListRoot({ movies, children }: MovieFilterableListProps) {
  const { filters, actions, metadata, filteredMovies } = useFilters(movies);

  return (
    <MovieFilterableListContext.Provider
      value={{
        movies,
        filteredMovies,
        searchTerm: filters.searchTerm,
        setSearchTerm: actions.setSearchTerm,
        hasActiveFilters: metadata.hasActiveFilters,
        activeFiltersCount: metadata.activeFiltersCount,
      }}
    >
      {children}
    </MovieFilterableListContext.Provider>
  );
}

function useMovieFilterableList(): MovieFilterableListContextValue {
  const context = useContext(MovieFilterableListContext);
  if (!context) {
    throw new Error("useMovieFilterableList must be used within MovieFilterableList");
  }
  return context;
}

interface MovieFilterableListSearchProps {
  placeholder?: string;
  className?: string;
}

function MovieFilterableListSearch({
  placeholder = "Search movies...",
  className = "w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
}: MovieFilterableListSearchProps) {
  const { searchTerm, setSearchTerm } = useMovieFilterableList();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={className}
      />
      <svg
        className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

interface MovieFilterableListItemsProps {
  renderItem: (movie: Movie, index: number) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
}

function MovieFilterableListItems({
  renderItem,
  emptyState,
  className,
}: MovieFilterableListItemsProps) {
  const { filteredMovies } = useMovieFilterableList();

  if (filteredMovies.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      {filteredMovies.map((movie, index) => (
        <div key={movie._id}>
          {renderItem(movie, index)}
        </div>
      ))}
    </div>
  );
}

interface MovieFilterableListStatsProps {
  className?: string;
}

function MovieFilterableListStats({
  className = "text-sm text-gray-600",
}: MovieFilterableListStatsProps) {
  const { movies, filteredMovies, hasActiveFilters, activeFiltersCount } = useMovieFilterableList();

  return (
    <div className={className}>
      Showing {filteredMovies.length} of {movies.length} movies
      {hasActiveFilters && (
        <span className="ml-2 text-blue-600">
          ({activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active)
        </span>
      )}
    </div>
  );
}

// Compound component structure for movies
export const MovieFilterableList = {
  Root: MovieFilterableListRoot,
  Search: MovieFilterableListSearch,
  Items: MovieFilterableListItems,
  Stats: MovieFilterableListStats,
  useMovieFilterableList,
};