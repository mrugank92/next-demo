/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/fetchMoviesWithDetails.ts

import dotenv from "dotenv";
import connectMongoDB from "@/libs/dbConnect";
import Movie from "@/models/movie";

// Load environment variables
dotenv.config({ path: ".env.local" });

interface TmdbMovieBasic {
  id: number;
  title: string;
}

interface TmdbListResponse {
  page: number;
  results: TmdbMovieBasic[];
  total_pages: number;
}

interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;

  credits?: {
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
  images?: any;
  videos?: any;
}

async function fetchMovieList(page: number): Promise<TmdbListResponse> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY not set");

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed fetching movie list page ${page}`);
  return (await res.json()) as TmdbListResponse;
}

async function fetchMovieDetails(id: number): Promise<TmdbMovieDetails> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,images,videos`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`HTTP ${res.status} for movie ${id}: ${res.statusText}`);
    throw new Error(
      `Failed fetching details for movie ${id} - HTTP ${res.status}`
    );
  }
  return (await res.json()) as TmdbMovieDetails;
}

async function run() {
  await connectMongoDB();

  // Debug: Check if API key is loaded
  if (!process.env.TMDB_API_KEY) {
    console.error("TMDB_API_KEY environment variable is not set");
    process.exit(1);
  }
  console.log(
    "API Key loaded:",
    process.env.TMDB_API_KEY?.substring(0, 8) + "..."
  );

  const firstPage = await fetchMovieList(1);
  const totalPages = firstPage.total_pages;

  console.log(`Total pages: ${totalPages}`);

  for (let page = 1; page <= totalPages; page++) {
    console.log(`Fetching list page ${page}...`);
    const list = page === 1 ? firstPage : await fetchMovieList(page);

    for (const movie of list.results) {
      try {
        console.log(`Fetching details for: ${movie.title} (${movie.id})`);
        const details = await fetchMovieDetails(movie.id);

        // Optional: Extract director(s) for convenience
        const directors =
          details.credits?.crew.filter((c) => c.job === "Director") ?? [];

        await Movie.updateOne(
          { id: details.id },
          {
            $set: {
              ...details,
              directors,
              lastSyncedAt: new Date(),
            },
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(`Error processing movie ${movie.id}:`, err);
      }

      // TMDB free tier has rate limits → add delay (e.g. 500ms per call)
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  console.log("Done syncing movies with full details!");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
