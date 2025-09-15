import connectMongoDB from "@/libs/dbConnect";
import Movie from "@/models/movie";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Movie as MovieType } from "@/types/common";

interface FetchMoviesResult {
  movies: MovieType[];
  totalData: number;
  success: boolean;
  error?: string;
}

/**
 * Server-side function to fetch movies from MongoDB
 * This bypasses the HTTP layer for direct database access during SSR
 */
export async function fetchMoviesServerSide(page: number = 1): Promise<FetchMoviesResult> {
  try {
    // Get authentication from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return {
        movies: [],
        totalData: 0,
        success: false,
        error: "Authentication required"
      };
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return {
        movies: [],
        totalData: 0,
        success: false,
        error: "Server configuration error"
      };
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userId = decoded.userId;
    } catch {
      return {
        movies: [],
        totalData: 0,
        success: false,
        error: "Invalid authentication"
      };
    }

    // Connect to MongoDB
    await connectMongoDB();

    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    // Get total count
    const totalCount = await Movie.countDocuments();

    // Fetch movies with pagination, sorted by latest first
    // Use projection to only fetch needed fields for better performance
    const movies = await Movie.find({})
      .select('id title overview popularity release_date runtime genres poster_path backdrop_path vote_average vote_count image year link userId createdAt updatedAt')
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 })
      .lean(); // Use lean() for better performance and memory usage

    // Transform the data to ensure consistent structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedMovies: MovieType[] = movies.map((movie: Record<string, any>) => ({
      _id: movie._id.toString(),
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres || [],
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      credits: movie.credits,
      directors: movie.directors,
      image: movie.image,
      year: movie.year,
      link: movie.link,
      userId: movie.userId?.toString(),
      createdAt: movie.createdAt?.toISOString(),
      updatedAt: movie.updatedAt?.toISOString(),
    }));

    return {
      movies: transformedMovies,
      totalData: totalCount,
      success: true
    };

  } catch (error) {
    console.error("Error in fetchMoviesServerSide:", error);
    return {
      movies: [],
      totalData: 0,
      success: false,
      error: "Failed to fetch movies"
    };
  }
}

/**
 * Server-side function to get user authentication status
 */
export async function getServerSideAuth(): Promise<{ userId: string | null; isAuthenticated: boolean }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return { userId: null, isAuthenticated: false };
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return { userId: null, isAuthenticated: false };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return { userId: decoded.userId, isAuthenticated: true };

  } catch {
    return { userId: null, isAuthenticated: false };
  }
}

/**
 * Optimized server-side function to fetch movies by user ID
 * Uses database indexes and projection for better performance
 */
export async function fetchUserMoviesServerSide(userId: string, page: number = 1): Promise<FetchMoviesResult> {
  try {
    await connectMongoDB();

    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    // Count documents for this user
    const totalCount = await Movie.countDocuments({ userId });

    // Fetch user-specific movies with optimized query
    const movies = await Movie.find({ userId })
      .select('id title overview popularity release_date runtime genres poster_path backdrop_path vote_average vote_count image year link userId createdAt updatedAt')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }) // Sort by creation date for user movies
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedMovies: MovieType[] = movies.map((movie: Record<string, any>) => ({
      _id: movie._id.toString(),
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres || [],
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      image: movie.image,
      year: movie.year,
      link: movie.link,
      userId: movie.userId?.toString(),
      createdAt: movie.createdAt?.toISOString(),
      updatedAt: movie.updatedAt?.toISOString(),
    }));

    return {
      movies: transformedMovies,
      totalData: totalCount,
      success: true
    };

  } catch {
    console.error("Error in fetchUserMoviesServerSide");
    return {
      movies: [],
      totalData: 0,
      success: false,
      error: "Failed to fetch user movies"
    };
  }
}

/**
 * Optimized function to get movie statistics for dashboard
 * Reduces database calls by aggregating data
 */
export async function getMovieStatsServerSide(userId?: string): Promise<{
  totalMovies: number;
  userMovies: number;
  avgRating: number;
  success: boolean;
  error?: string;
}> {
  try {
    await connectMongoDB();

    const [totalStats, userStats] = await Promise.all([
      Movie.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            avgRating: { $avg: "$vote_average" }
          }
        }
      ]),
      userId ? Movie.countDocuments({ userId }) : Promise.resolve(0)
    ]);

    return {
      totalMovies: totalStats[0]?.totalCount || 0,
      userMovies: userStats,
      avgRating: totalStats[0]?.avgRating || 0,
      success: true
    };

  } catch {
    console.error("Error in getMovieStatsServerSide");
    return {
      totalMovies: 0,
      userMovies: 0,
      avgRating: 0,
      success: false,
      error: "Failed to fetch movie statistics"
    };
  }
}