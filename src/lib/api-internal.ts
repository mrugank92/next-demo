import connectMongoDB from "@/libs/dbConnect";
import Movie from "@/models/movie";
import { getServerSideAuth } from "./server-actions";

/**
 * Internal API utilities for server-side data fetching
 * These functions bypass HTTP and directly access the database for optimal SSR performance
 */

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalData: number;
  currentPage: number;
  totalPages: number;
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Internal function to fetch movies with advanced filtering and pagination
 * Optimized for server-side rendering with minimal database load
 */
export async function fetchMoviesInternal(options: {
  page?: number;
  pageSize?: number;
  userId?: string;
  genre?: string;
  year?: number;
  minRating?: number;
  maxRuntime?: number;
  searchTerm?: string;
  sortBy?: 'latest' | 'rating' | 'title' | 'year';
  sortOrder?: 'asc' | 'desc';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<PaginatedResponse<Record<string, any>>> {
  try {
    await connectMongoDB();

    const {
      page = 1,
      pageSize = 15,
      userId,
      genre,
      year,
      minRating,
      maxRuntime,
      searchTerm,
      sortBy = 'latest',
      sortOrder = 'desc'
    } = options;

    // Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (genre) {
      filter['genres.name'] = genre;
    }
    
    if (year) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter.$or = [
        { year },
        { release_date: { $regex: `^${year}` } }
      ];
    }
    
    if (minRating) {
      filter.vote_average = { $gte: minRating };
    }
    
    if (maxRuntime) {
      filter.runtime = { $lte: maxRuntime };
    }
    
    if (searchTerm) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { overview: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Build sort criteria
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortCriteria: Record<string, any> = {};
    switch (sortBy) {
      case 'rating':
        sortCriteria.vote_average = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'title':
        sortCriteria.title = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'year':
        sortCriteria.year = sortOrder === 'desc' ? -1 : 1;
        sortCriteria.release_date = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'latest':
      default:
        sortCriteria._id = -1;
        break;
    }

    const skip = (page - 1) * pageSize;

    // Execute queries in parallel for better performance
    const [movies, totalCount] = await Promise.all([
      Movie.find(filter)
        .select('id title overview popularity release_date runtime genres poster_path backdrop_path vote_average vote_count image year link userId createdAt updatedAt')
        .skip(skip)
        .limit(pageSize)
        .sort(sortCriteria)
        .lean(),
      Movie.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: movies,
      totalData: totalCount,
      currentPage: page,
      totalPages,
      success: true,
      message: "Movies fetched successfully"
    };

  } catch (error) {
    console.error("Error in fetchMoviesInternal:", error);
    return {
      data: [],
      totalData: 0,
      currentPage: options.page || 1,
      totalPages: 0,
      success: false,
      error: "Failed to fetch movies"
    };
  }
}

/**
 * Internal function to fetch a single movie by ID
 * Optimized for server-side rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMovieByIdInternal(movieId: string): Promise<ApiResponse<Record<string, any>>> {
  try {
    await connectMongoDB();

    const movie = await Movie.findById(movieId)
      .select('id title overview popularity release_date runtime genres poster_path backdrop_path vote_average vote_count credits directors image year link userId createdAt updatedAt')
      .lean();

    if (!movie) {
      return {
        data: null,
        success: false,
        message: "Movie not found"
      };
    }

    return {
      data: movie,
      success: true,
      message: "Movie fetched successfully"
    };

  } catch (error) {
    console.error("Error in fetchMovieByIdInternal:", error);
    return {
      data: null,
      success: false,
      error: "Failed to fetch movie"
    };
  }
}

/**
 * Internal function to get movie genres for filtering
 * Cached for better performance
 */
export async function getMovieGenresInternal(): Promise<ApiResponse<string[]>> {
  try {
    await connectMongoDB();

    const genres = await Movie.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres.name' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: '$_id' } }
    ]);

    const genreNames = genres.map(g => g.name).filter(Boolean);

    return {
      data: genreNames,
      success: true,
      message: "Genres fetched successfully"
    };

  } catch (error) {
    console.error("Error in getMovieGenresInternal:", error);
    return {
      data: [],
      success: false,
      error: "Failed to fetch genres"
    };
  }
}

/**
 * Wrapper function for authenticated server-side requests
 * Automatically handles authentication and returns appropriate responses
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function withServerAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<T | ApiResponse<null>> {
  const { userId, isAuthenticated } = await getServerSideAuth();
  
  if (!isAuthenticated || !userId) {
    return {
      data: null,
      success: false,
      error: "Authentication required"
    } as ApiResponse<null>;
  }

  return handler(userId);
}