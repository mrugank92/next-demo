import { useSWRConfig } from "swr";
import { Movie } from "@/types/common";

export function useMovieMutations() {
  const { mutate } = useSWRConfig();

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
