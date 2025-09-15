import { useCallback, useState } from "react";
import { useMovieMutations } from "./useMovieMutations";
import { Movie } from "@/types/common";

export interface MovieOperationState {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

export function useMovieOperations() {
  const { createMovie, updateMovie, deleteMovie } = useMovieMutations();
  const [state, setState] = useState<MovieOperationState>({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
  });

  const handleCreateMovie = useCallback(
    async (movieData: Omit<Movie, "_id">) => {
      setState(prev => ({ ...prev, isCreating: true, error: null }));
      try {
        const result = await createMovie(movieData);
        setState(prev => ({ ...prev, isCreating: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create movie";
        setState(prev => ({ ...prev, isCreating: false, error: errorMessage }));
        throw error;
      }
    },
    [createMovie]
  );

  const handleUpdateMovie = useCallback(
    async (id: string, movieData: Partial<Movie>) => {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));
      try {
        const result = await updateMovie(id, movieData);
        setState(prev => ({ ...prev, isUpdating: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update movie";
        setState(prev => ({ ...prev, isUpdating: false, error: errorMessage }));
        throw error;
      }
    },
    [updateMovie]
  );

  const handleDeleteMovie = useCallback(
    async (id: string) => {
      setState(prev => ({ ...prev, isDeleting: true, error: null }));
      try {
        const result = await deleteMovie(id);
        setState(prev => ({ ...prev, isDeleting: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete movie";
        setState(prev => ({ ...prev, isDeleting: false, error: errorMessage }));
        throw error;
      }
    },
    [deleteMovie]
  );

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    operations: {
      createMovie: handleCreateMovie,
      updateMovie: handleUpdateMovie,
      deleteMovie: handleDeleteMovie,
    },
    clearError,
  };
}