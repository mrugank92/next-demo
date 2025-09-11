"use client";

import { MovieCardProps } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useMovieMutations } from "@/hooks/useMovieMutations";

/**
 * MovieCard Component
 *
 * Displays a movie card with an image, title, and year/release date.
 * Includes a link to edit the movie details.
 * Utilizes Next.js Image component for optimized image loading.
 * Handles both TMDB movies and user-added movies.
 */
const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { deleteMovie } = useMovieMutations();
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine image source - prioritize user image, then TMDB poster, then backdrop
  const getImageSrc = () => {
    if (movie.image) return movie.image;
    if (movie.poster_path)
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    if (movie.backdrop_path)
      return `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    return "/placeholder-movie.svg"; // Placeholder image
  };

  // Determine the year - use year field or extract from release_date
  const getYear = () => {
    if (movie.year) return movie.year;
    if (movie.release_date) return new Date(movie.release_date).getFullYear();
    return null;
  };

  const year = getYear();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMovie(movie._id as string);
    } catch (error) {
      console.error("Failed to delete movie:", error);
      alert("Failed to delete movie. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 h-full flex flex-col relative">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full p-2 transition-colors duration-200"
        aria-label="Delete movie"
      >
        {isDeleting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      <Link
        href={`/edit/${movie._id}`}
        className="relative hover:cursor-pointer flex-shrink-0"
      >
        <Image
          src={getImageSrc()}
          alt={`Cover image for ${movie.title}`}
          width={300}
          height={400}
          className="rounded-t-lg h-[300px] w-full object-cover"
          priority
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="body-large font-semibold line-clamp-2 mb-2">{movie.title}</h2>
        {year && <p className="text-gray-400 text-sm mb-2">{year}</p>}
        {movie.overview && (
          <p
            className="text-gray-500 text-sm flex-grow overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {movie.overview}
          </p>
        )}
        {movie.vote_average && (
          <div className="flex items-center mt-auto pt-2">
            <span className="text-yellow-400 mr-1">⭐</span>
            <span className="text-sm text-gray-400">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Memoized MovieCard Component
 *
 * Prevents unnecessary re-renders if the movie prop hasn't changed.
 */
export default React.memo(MovieCard);
