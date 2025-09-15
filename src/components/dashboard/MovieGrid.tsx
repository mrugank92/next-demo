"use client";

import { Movie } from "@/types/common";
import MovieCard from "../cards/MovieCard";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

export default function MovieGrid({ movies, isLoading = false }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg aspect-[2/3]"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
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
    );
  }

  return (
    <div
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
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
  );
}