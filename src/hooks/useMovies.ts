import useSWR from "swr";
import { Movie } from "@/types/common";

interface FetchMoviesResponse {
  success: boolean;
  data: Movie[];
  totalData: number;
  message?: string;
}

interface UseMoviesOptions {
  page?: number;
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  initialData?: FetchMoviesResponse;
}

export function useMovies(options: UseMoviesOptions = {}) {
  const {
    page = 1,
    refreshInterval = 0,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    initialData,
  } = options;

  const { data, error, isLoading, mutate, isValidating } = useSWR<FetchMoviesResponse>(
    `/api/movies?page=${page}`,
    {
      refreshInterval,
      revalidateOnFocus,
      revalidateOnReconnect,
      // Revalidate immediately on mount
      revalidateIfStale: true,
      // Keep previous data while loading new data
      keepPreviousData: true,
      // Use server-side initial data for SSR
      fallbackData: initialData,
    }
  );

  return {
    movies: data?.data || [],
    totalData: data?.totalData || 0,
    isLoading,
    isValidating,
    error,
    mutate,
    isError: !!error,
  };
}

export function useMovieById(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Movie }>(
    id ? `/api/movies/${id}` : null
  );

  return {
    movie: data?.data,
    isLoading,
    error,
    mutate,
    isError: !!error,
  };
}