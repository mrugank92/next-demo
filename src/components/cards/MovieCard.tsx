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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
    <div
      className="relative h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transform-gpu"
      style={{
        willChange: "transform", // Optimize animation performance
      }}
    >
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`
          absolute top-2 right-2 sm:top-3 sm:right-3 z-10 
          rounded-full p-2 transition-all duration-200 
          min-w-touch-target min-h-touch-target 
          flex items-center justify-center
          text-white shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${
            isDeleting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 cursor-pointer hover:bg-red-600 hover:shadow-lg hover:scale-110"
          }
        `}
        role="button"
        aria-label={`Delete ${movie.title || "movie"}`}
        aria-describedby={`delete-help-${movie._id}`}
      >
        {isDeleting ? (
          <div
            className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
            role="status"
            aria-label="Deleting movie"
          ></div>
        ) : (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      <Link
        href={`/edit/${movie._id}`}
        className="relative block hover:cursor-pointer flex-shrink-0 group min-h-touch-target"
        aria-label={`Edit ${movie.title || "movie"}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-t-lg">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center rounded-t-lg text-gray-400">
              <svg
                className="w-12 h-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Image unavailable</span>
            </div>
          )}

          <Image
            src={getImageSrc()}
            alt={`Cover image for ${movie.title || "Untitled movie"}`}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            } rounded-t-lg`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 320px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="line-clamp-2 mb-2 text-lg font-semibold leading-tight text-gray-900">
          {movie.title}
        </h2>
        {year && (
          <p className="mb-2 text-sm font-medium text-gray-400 leading-normal">
            {year}
          </p>
        )}
        {movie.overview && (
          <p className="flex-grow overflow-hidden mb-3 line-clamp-3 text-sm font-normal text-gray-600 leading-normal">
            {movie.overview}
          </p>
        )}
        {movie.vote_average && (
          <div className="flex items-center mt-auto pt-2">
            <span className="mr-2 text-yellow-400 text-base">⭐</span>
            <span className="text-sm font-medium text-gray-600">
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
