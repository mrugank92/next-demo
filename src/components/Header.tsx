"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/common";
import Languages from "./Languages";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  maxRuntime: number;
  setMaxRuntime: (runtime: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  movies: Movie[];
  filteredAndSortedMovies: Movie[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  minRating,
  setMinRating,
  maxRuntime,
  setMaxRuntime,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters,
  setCurrentPage,
  movies,
  filteredAndSortedMovies,
}) => {
  const router = useRouter();

  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach((movie) => {
      movie.genres?.forEach((genre) => {
        if (genre.name) genres.add(genre.name);
      });
    });
    return Array.from(genres).sort();
  }, [movies]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    movies.forEach((movie) => {
      const year =
        movie.year ||
        (movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : null);
      if (year) {
        const numYear = typeof year === "string" ? parseInt(year, 10) : year;
        if (!isNaN(numYear)) years.add(numYear);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [movies]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedYear("");
    setMinRating(0);
    setMaxRuntime(0);
    setSortBy("title");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const handleLogout = useCallback(() => {
    try {
      deleteCookie("token");
      router.push("/sign-in"); // Client-side navigation without full reload
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedGenre) count++;
    if (selectedYear) count++;
    if (minRating > 0) count++;
    if (maxRuntime > 0) count++;
    return count;
  }, [searchTerm, selectedGenre, selectedYear, minRating, maxRuntime]);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <h2
              id="movies-heading"
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Movie Collection
            </h2>
            <Link
              href="/add"
              className="flex items-center transition-all duration-200 ease-in-out hover:scale-105  rounded-lg p-1 flex-shrink-0 focus-ring"
            >
              <Image
                src="/plus.svg"
                width={15}
                height={15}
                className="sm:w-6 sm:h-6 mb-1"
                alt=""
                role="presentation"
                style={{
                  filter:
                    "invert(37%) sepia(93%) saturate(590%) hue-rotate(122deg) brightness(98%) contrast(89%)",
                }}
              />
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {filteredAndSortedMovies.length} of {movies.length} movies
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {availableGenres.length} genres
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {availableYears.length} years
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters
                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

          <div className="flex justify-between items-center gap-3 sm:gap-4">
            {/* Right Section: Languages and Logout */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Languages />
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm focus-ring hover:outline-green-300 min-h-touch-target"
              >
                <span className="body-regular hidden sm:inline text-xs sm:text-sm whitespace-nowrap">
                  Logout
                </span>
                <Image
                  src="/logout.svg"
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                  alt=""
                  role="presentation"
                  style={{
                    filter:
                      "invert(37%) sepia(93%) saturate(590%) hue-rotate(122deg) brightness(98%) contrast(89%)",
                  }}
                />
              </button>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
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
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {availableGenres.map((genre) => (
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
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rating: {minRating > 0 ? minRating.toFixed(1) : "Any"}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Runtime Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Runtime: {maxRuntime > 0 ? `${maxRuntime} min` : "Any"}
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="15"
                value={maxRuntime}
                onChange={(e) => setMaxRuntime(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="title">Title</option>
                  <option value="year">Year</option>
                  <option value="rating">Rating</option>
                  <option value="popularity">Popularity</option>
                  <option value="runtime">Runtime</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={sortOrder === "asc" ? "Ascending" : "Descending"}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
