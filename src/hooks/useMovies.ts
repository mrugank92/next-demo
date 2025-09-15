import useSWR from "swr";
import { useEffect } from "react";
import { Movie } from "@/types/common";
import { useNetworkState } from "./useNetworkState";

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
  initialData?: {
    movies: Movie[];
    totalData: number;
  };
}

export function useMovies(options: UseMoviesOptions = {}) {
  const {
    page = 1,
    refreshInterval = 0,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    initialData,
  } = options;

  const { isOnline, reconnected, clearReconnectedFlag } = useNetworkState();

  // Transform initial data to match API response format
  const fallbackData = initialData ? {
    success: true,
    data: initialData.movies,
    totalData: initialData.totalData,
  } : undefined;

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<FetchMoviesResponse>(`/api/movies?page=${page}`, {
      refreshInterval,
      revalidateOnFocus: revalidateOnFocus && isOnline,
      revalidateOnReconnect: revalidateOnReconnect && isOnline,
      revalidateIfStale: isOnline,
      keepPreviousData: true,
      fallbackData,
      // Disable fetching when offline
      isPaused: () => !isOnline,
    });

  // Auto-revalidate when coming back online
  useEffect(() => {
    if (reconnected && isOnline) {
      mutate();
      clearReconnectedFlag();
    }
  }, [reconnected, isOnline, mutate, clearReconnectedFlag]);

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
