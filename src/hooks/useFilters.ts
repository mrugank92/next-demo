import { useState, useMemo } from "react";
import { Movie } from "@/types/common";

export interface FilterState {
  searchTerm: string;
  selectedGenre: string;
  selectedYear: string;
  minRating: number;
  maxRuntime: number;
}

export interface FilterActions {
  setSearchTerm: (term: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSelectedYear: (year: string) => void;
  setMinRating: (rating: number) => void;
  setMaxRuntime: (runtime: number) => void;
  resetFilters: () => void;
}

export interface FilterMetadata {
  availableGenres: string[];
  availableYears: number[];
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

const initialFilterState: FilterState = {
  searchTerm: "",
  selectedGenre: "",
  selectedYear: "",
  minRating: 0,
  maxRuntime: 0,
};

export function useFilters(movies: Movie[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const actions: FilterActions = {
    setSearchTerm: (term: string) =>
      setFilters((prev) => ({ ...prev, searchTerm: term })),
    setSelectedGenre: (genre: string) =>
      setFilters((prev) => ({ ...prev, selectedGenre: genre })),
    setSelectedYear: (year: string) =>
      setFilters((prev) => ({ ...prev, selectedYear: year })),
    setMinRating: (rating: number) =>
      setFilters((prev) => ({ ...prev, minRating: rating })),
    setMaxRuntime: (runtime: number) =>
      setFilters((prev) => ({ ...prev, maxRuntime: runtime })),
    resetFilters: () => setFilters(initialFilterState),
  };

  const metadata: FilterMetadata = useMemo(() => {
    const availableGenres = Array.from(
      new Set(
        movies.flatMap((movie) =>
          movie.genres?.map((genre) => genre.name).filter(Boolean) || []
        )
      )
    ).sort();

    const availableYears = Array.from(
      new Set(
        movies
          .map((movie) => {
            const year =
              movie.year ||
              (movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : null);
            return typeof year === "string" ? parseInt(year, 10) : year;
          })
          .filter((year): year is number => typeof year === "number" && !isNaN(year))
      )
    ).sort((a, b) => b - a);

    const activeFiltersCount = [
      filters.searchTerm,
      filters.selectedGenre,
      filters.selectedYear,
      filters.minRating > 0 ? filters.minRating : null,
      filters.maxRuntime > 0 ? filters.maxRuntime : null,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFiltersCount > 0;

    return {
      availableGenres,
      availableYears,
      hasActiveFilters,
      activeFiltersCount,
    };
  }, [movies, filters]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Search term filter
      if (
        filters.searchTerm &&
        !movie.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !movie.overview?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Genre filter
      if (
        filters.selectedGenre &&
        !movie.genres?.some((g) => g.name === filters.selectedGenre)
      ) {
        return false;
      }

      // Year filter
      if (filters.selectedYear) {
        const movieYear =
          movie.year ||
          (movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null);
        if (movieYear !== parseInt(filters.selectedYear)) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating > 0 && (movie.vote_average || 0) < filters.minRating) {
        return false;
      }

      // Runtime filter
      if (filters.maxRuntime > 0 && movie.runtime && movie.runtime > filters.maxRuntime) {
        return false;
      }

      return true;
    });
  }, [movies, filters]);

  return {
    filters,
    actions,
    metadata,
    filteredMovies,
  };
}