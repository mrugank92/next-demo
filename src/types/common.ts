/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RouteParams {
  id: string;
}

/**
 * Interface representing a user.
 */
export interface User {
  _id: string;
  email: string;
}

/**
 * Interface representing the data returned from authentication APIs.
 */
export interface AuthResponseData {
  token: string;
  user: User;
}

/**
 * Interface representing the overall authentication response.
 */
export interface AuthResponse {
  data: AuthResponseData;
}

/**
 * Interface representing a movie.
 */
export interface Movie {
  _id?: string;
  id?: number; // TMDB id
  image?: string; // User-added image
  title: string;
  year?: number | string;
  overview?: string; // TMDB description
  popularity?: number; // TMDB popularity
  release_date?: string; // TMDB release date
  runtime?: number; // Movie runtime in minutes
  genres?: { // TMDB genres
    id: number;
    name: string;
  }[];
  poster_path?: string; // TMDB poster
  backdrop_path?: string; // TMDB backdrop
  vote_average?: number; // TMDB rating
  vote_count?: number; // TMDB vote count
  credits?: { // TMDB cast and crew
    cast: {
      id: number;
      name: string;
      character: string;
      order: number;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
  directors?: { // Extracted directors for convenience
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
  images?: any; // TMDB images
  videos?: any; // TMDB videos
  lastSyncedAt?: Date; // Last sync timestamp
  link?: string; // User-added link
  userId?: string; // User who added the movie
}

/**
 * Props interface for the MovieCard component.
 */
export interface MovieCardProps {
  movie: Movie;
}

export interface GetMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}

export interface UpdateMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}

export interface DeleteMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}
