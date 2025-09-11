"use client";

import { useState, useMemo } from "react";
import MovieCard from "./cards/MovieCard";
import Pagination from "./Pagination";
import Loading from "./Loading";
import EmptyDashboard from "./EmptyDashboard";
import { useMovies } from "@/hooks/useMovies";

const PAGE_SIZE = 8;

export default function DashBoard() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Use SWR with server-side initial data
  const { movies, totalData, isLoading, isError, error } = useMovies({
    page: currentPage,
  });

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
      className="flex flex-col justify-center items-center px-3 sm:px-4 md:px-6"
      aria-labelledby="movies-heading"
    >
      <div className="w-full max-w-5xl">
        <h2 id="movies-heading" className="visually-hidden">
          Your Movie Collection
        </h2>
        <div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          role="grid"
          aria-label={`Movie grid showing ${movies.length} movies`}
        >
          {movies.map((movie, index) => (
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
