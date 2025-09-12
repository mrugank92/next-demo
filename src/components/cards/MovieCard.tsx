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
        
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          {year && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              {year}
            </span>
          )}
          
          {movie.runtime && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              {movie.runtime}m
            </span>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={`${genre.id}-${index}`}
                  className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
              {movie.genres.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  +{movie.genres.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Directors */}
        {movie.directors && movie.directors.length > 0 && (
          <div className="mb-3 text-xs text-gray-600">
            <span className="font-medium">Director: </span>
            {movie.directors.slice(0, 2).map(d => d.name).join(", ")}
            {movie.directors.length > 2 && ` +${movie.directors.length - 2} more`}
          </div>
        )}

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mb-3 text-xs text-gray-600">
            <span className="font-medium">Cast: </span>
            {movie.credits.cast.slice(0, 3).map(actor => actor.name).join(", ")}
            {movie.credits.cast.length > 3 && ` +${movie.credits.cast.length - 3} more`}
          </div>
        )}

        {movie.overview && (
          <p className="flex-grow overflow-hidden mb-3 line-clamp-3 text-sm font-normal text-gray-600 leading-normal">
            {movie.overview}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
            {movie.vote_average && movie.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-base">⭐</span>
                  <span className="text-sm font-semibold text-gray-800 ml-1">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                {movie.vote_count && (
                  <span className="text-xs text-gray-500">
                    ({movie.vote_count > 1000 ? `${(movie.vote_count / 1000).toFixed(1)}k` : movie.vote_count})
                  </span>
                )}
              </div>
            )}
            
            {movie.popularity && movie.popularity > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {movie.popularity > 1000 ? `${(movie.popularity / 1000).toFixed(1)}k` : Math.round(movie.popularity)}
              </div>
            )}
          </div>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`
              flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 
              text-xs font-medium
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
              ${
                isDeleting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-600 hover:bg-red-50"
              }
            `}
            role="button"
            aria-label={`Delete ${movie.title || "movie"}`}
          >
            {isDeleting ? (
              <>
                <span>Deleting</span>
                <div
                  className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"
                  role="status"
                  aria-label="Deleting movie"
                ></div>
              </>
            ) : (
              <>
                <span>Delete</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
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