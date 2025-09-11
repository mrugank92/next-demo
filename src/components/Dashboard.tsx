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
      <div className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden">
        <p className="text-red-500">
          {error?.message || "Failed to load movies"}
        </p>
      </div>
    );
  }

  if (!movies.length) {
    return <EmptyDashboard />;
  }

  return (
    <div className="flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={setCurrentPage}
      />
    </div>
  );
}
