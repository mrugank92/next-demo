import { useSWRConfig } from "swr";
import { Movie } from "@/types/common";
import { useNetworkState } from "./useNetworkState";
import { offlineStorage } from "@/lib/offlineStorage";
import { toast } from "react-toastify";

export function useMovieMutations() {
  const { mutate } = useSWRConfig();
  const { isOnline } = useNetworkState();

  const createMovie = async (movieData: Omit<Movie, "_id">) => {
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        throw new Error("Failed to create movie");
      }

      const result = await response.json();

      // Revalidate all movie list pages
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/movies?page="),
        undefined,
        { revalidate: true }
      );

      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to update movie";
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Revalidate specific movie and all movie list pages
      await mutate(`/api/movies/${id}`, result, { revalidate: false });
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/movies?page="),
        undefined,
        { revalidate: true }
      );

      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      if (!isOnline) {
        // Store action for later sync
        await offlineStorage.addPendingAction({
          type: "DELETE",
          data: {},
          movieId: id,
        });

        // Optimistically update local cache
        await mutate(
          (key) => typeof key === "string" && key.startsWith("/api/movies?page="),
          (data: { data?: Movie[], totalData?: number } | undefined) => {
            if (!data?.data) return data;
            return {
              ...data,
              data: data.data?.filter((movie: Movie) => movie._id !== id) || [],
              totalData: (data.totalData || 0) - 1,
            };
          },
          { revalidate: false }
        );

        toast.info("✈️ Movie deletion queued for sync when online", {
          position: "top-right",
          autoClose: 3000,
        });

        return { success: true, offline: true };
      }

      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      // Revalidate all movie list pages
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/movies?page="),
        undefined,
        { revalidate: true }
      );

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  return {
    createMovie,
    updateMovie,
    deleteMovie,
  };
}
