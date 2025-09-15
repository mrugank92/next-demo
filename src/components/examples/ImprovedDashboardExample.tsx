"use client";

import { Movie } from "@/types/common";
import { useMovies } from "@/hooks/useMovies";

import { MovieFilterableList } from "@/components/compound/MovieFilterableList";
import { AsyncDataRenderer } from "@/components/render-props/AsyncDataRenderer";
import { withLoading } from "@/components/common/WithLoading";
import { ConditionalRenderer, ListRenderer } from "@/components/common/ConditionalRenderer";
import MovieCard from "@/components/cards/MovieCard";
import EmptyDashboard from "@/components/EmptyDashboard";

interface ImprovedDashboardProps {
  initialMovies?: Movie[];
  initialTotalData?: number;
  initialPage?: number;
}

// Example using render props pattern
function DashboardWithRenderProps({ initialMovies = [] }: ImprovedDashboardProps) {
  return (
    <AsyncDataRenderer
      data={initialMovies}
      loading={false}
      error={null}
    >
      {({ data, loading, error }) => (
        <div className="dashboard-container">
          <ConditionalRenderer condition={loading}>
            <div>Loading movies...</div>
          </ConditionalRenderer>
          
          <ConditionalRenderer condition={!!error}>
            <div className="error">Error: {error?.message}</div>
          </ConditionalRenderer>
          
          <ConditionalRenderer condition={!loading && !error && !!data}>
            <ListRenderer
              items={data || []}
              renderItem={(movie) => <MovieCard movie={movie} />}
              keyExtractor={(movie) => movie._id || `movie-${Math.random()}`}
              emptyState={<EmptyDashboard />}
            />
          </ConditionalRenderer>
        </div>
      )}
    </AsyncDataRenderer>
  );
}

// Example using compound component pattern
function DashboardWithCompoundComponents({ initialMovies = [] }: ImprovedDashboardProps) {
  return (
    <MovieFilterableList.Root movies={initialMovies}>
      <div className="dashboard-header">
        <h1>Movies</h1>
        <MovieFilterableList.Stats />
      </div>
      
      <MovieFilterableList.Search 
        placeholder="Search movies..." 
        className="mb-4"
      />
      
      <MovieFilterableList.Items
        renderItem={(movie: Movie) => <MovieCard movie={movie} />}
        emptyState={<EmptyDashboard />}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      />
    </MovieFilterableList.Root>
  );
}

// Example using HOC pattern
const MovieListWithLoading = withLoading(
  ({ movies }: { movies: Movie[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  )
);

function DashboardWithHOC({ initialPage = 1, initialMovies = [], initialTotalData = 0 }: ImprovedDashboardProps) {
  const { movies, isLoading, error } = useMovies({
    page: initialPage,
    initialData: { movies: initialMovies, totalData: initialTotalData }
  });

  return (
    <div className="dashboard-container">
      <h1>Movies Dashboard</h1>
      <MovieListWithLoading
        movies={movies}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export {
  DashboardWithRenderProps,
  DashboardWithCompoundComponents,
  DashboardWithHOC,
};