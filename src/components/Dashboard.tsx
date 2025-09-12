"use client";

import { useState, useMemo } from "react";
import MovieCard from "./cards/MovieCard";
import Pagination from "./Pagination";
import Loading from "./Loading";
import EmptyDashboard from "./EmptyDashboard";
import DashboardHeader from "./Header";
import { useMovies } from "@/hooks/useMovies";

const PAGE_SIZE = 8;

export default function DashBoard() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRuntime, setMaxRuntime] = useState<number>(0);

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Use SWR with server-side initial data
  const { movies, totalData, isLoading, isError, error } = useMovies({
    page: currentPage,
  });

  // Filter movies based on current filters (no sorting)
  const filteredAndSortedMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Search term filter
      if (
        searchTerm &&
        !movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !movie.overview?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Genre filter
      if (
        selectedGenre &&
        !movie.genres?.some((g) => g.name === selectedGenre)
      ) {
        return false;
      }

      // Year filter
      if (selectedYear) {
        const movieYear =
          movie.year ||
          (movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null);
        if (movieYear !== parseInt(selectedYear)) {
          return false;
        }
      }

      // Rating filter
      if (minRating > 0 && (movie.vote_average || 0) < minRating) {
        return false;
      }

      // Runtime filter
      if (maxRuntime > 0 && movie.runtime && movie.runtime > maxRuntime) {
        return false;
      }

      return true;
    });
  }, [
    movies,
    searchTerm,
    selectedGenre,
    selectedYear,
    minRating,
    maxRuntime,
  ]);

  const totalPages = useMemo(
    () => Math.ceil(totalData / PAGE_SIZE),
    [totalData]
  );

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
          An error occurred while loading your movies. Please try refreshing the
          page.
        </span>
      </section>
    );
  }

  if (!movies.length) {
    return <EmptyDashboard />;
  }

  return (
    <section
      className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 py-2"
      aria-labelledby="movies-heading"
    >
      <div className="w-full max-w-7xl">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          minRating={minRating}
          setMinRating={setMinRating}
          maxRuntime={maxRuntime}
          setMaxRuntime={setMaxRuntime}

          showFilters={showFilters}
          setShowFilters={setShowFilters}
          setCurrentPage={setCurrentPage}
          movies={movies}
          filteredAndSortedMovies={filteredAndSortedMovies}
        />

        {/* Movies Grid */}
        {filteredAndSortedMovies.length > 0 ? (
          <div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
            role="grid"
            aria-label={`Movie grid showing ${filteredAndSortedMovies.length} movies`}
          >
            {filteredAndSortedMovies.map((movie, index) => (
              <div
                key={movie._id}
                className="fc-stagger-item"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                role="gridcell"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No movies found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search term to find more movies.
            </p>
          </div>
        )}
      </div>

      <nav aria-label="Movie collection pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={setCurrentPage}
        />
      </nav>
    </section>
  );
}
