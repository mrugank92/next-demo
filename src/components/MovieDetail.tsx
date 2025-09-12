"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMovieById } from "@/hooks/useMovies";

interface MovieDetailProps {
  movieId: string;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId }) => {
  const { movie, isLoading, error, isError } = useMovieById(movieId);
  const router = useRouter();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">
          {error?.message || "Failed to load movie"}
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl mb-4">Movie not found</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section with Backdrop */}
          {movie.backdrop_path && (
            <div className="relative h-64 md:h-96 bg-gray-900">
              <Image
                src={
                  movie.backdrop_path.startsWith("http")
                    ? movie.backdrop_path
                    : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                }
                alt={`${movie.title} backdrop`}
                fill
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  {movie.title}
                </h1>
                <div className="flex items-center gap-4 text-sm md:text-base">
                  <span>
                    {movie.year ||
                      (movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "Unknown")}
                  </span>
                  <span>•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                  {movie.vote_average && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Poster and Quick Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  {/* Poster */}
                  <div className="relative w-full max-w-sm mx-auto mb-6">
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={
                          movie.image ||
                          (movie.poster_path
                            ? movie.poster_path.startsWith("http")
                              ? movie.poster_path
                              : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/placeholder-movie.png")
                        }
                        alt={`${movie.title} poster`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-6">
                    <Link
                      href={`/edit/${movie._id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    {movie.link && (
                      <a
                        href={movie.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
                      >
                        Watch
                      </a>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Release Date
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(movie.release_date)}
                      </p>
                    </div>

                    {movie.popularity && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Popularity
                        </h3>
                        <p className="text-gray-600">
                          {movie.popularity.toFixed(1)}
                        </p>
                      </div>
                    )}

                    {movie.vote_count && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Vote Count
                        </h3>
                        <p className="text-gray-600">
                          {movie.vote_count.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                {movie.overview && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.overview}
                    </p>
                  </section>
                )}

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Genres
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={genre.id || index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Cast */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Cast
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movie.credits.cast.slice(0, 12).map((actor, index) => (
                        <div key={actor.id || index} className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200">
                            {actor.profile_path && (
                              <Image
                                src={
                                  actor.profile_path.startsWith("http")
                                    ? actor.profile_path
                                    : `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                }
                                alt={actor.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <p className="font-medium text-sm text-gray-900">
                            {actor.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {actor.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Directors */}
                {movie.directors && movie.directors.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Directors
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {movie.directors.map((director, index) => (
                        <div
                          key={director.id || index}
                          className="flex items-center gap-3"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {director.profile_path && (
                              <Image
                                src={
                                  director.profile_path.startsWith("http")
                                    ? director.profile_path
                                    : `https://image.tmdb.org/t/p/w185${director.profile_path}`
                                }
                                alt={director.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {director.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {director.job}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Additional Info */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Additional Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="font-semibold text-gray-900">Runtime</dt>
                        <dd className="text-gray-600">
                          {formatRuntime(movie.runtime)}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">Rating</dt>
                        <dd className="text-gray-600">
                          {movie.vote_average
                            ? `${movie.vote_average.toFixed(1)}/10`
                            : "Not rated"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">
                          Popularity
                        </dt>
                        <dd className="text-gray-600">
                          {movie.popularity?.toFixed(1) || "Unknown"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-900">Votes</dt>
                        <dd className="text-gray-600">
                          {movie.vote_count?.toLocaleString() || "No votes"}
                        </dd>
                      </div>
                      {movie.lastSyncedAt && (
                        <div className="md:col-span-2">
                          <dt className="font-semibold text-gray-900">
                            Last Updated
                          </dt>
                          <dd className="text-gray-600">
                            {formatDate(movie.lastSyncedAt?.toString())}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
