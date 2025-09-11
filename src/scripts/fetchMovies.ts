import connectMongoDB from "@/libs/dbConnect";
import Movie from "@/models/movie";
import axios from "axios";

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  popularity: number;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  // add more fields from TMDB as needed
}

interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

async function fetchTmdbPage(page: number): Promise<TmdbResponse> {
  const apiKey = "f5ca00cfc404fd46770e0515aab10f1c";
  if (!apiKey) throw new Error("TMDB_API_KEY not set");

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
  const res = await axios.get(url);
  if (res.status !== 200) {
    throw new Error(
      `TMDB fetch failed for page ${page}: ${res.status} ${res.statusText}`
    );
  }
  const data = res.data as TmdbResponse;
  return data;
}

async function run() {
  await connectMongoDB();

  // fetch first page to know total_pages
  const first = await fetchTmdbPage(1);

  console.log(
    `Total pages: ${first.total_pages}, total results: ${first.total_results}`
  );

  // process page 1
  for (const movie of first.results) {
    try {
      await Movie.findOneAndUpdate({ id: movie.id }, movie, {
        upsert: true,
        new: true,
      });
    } catch (e) {
      console.error(`Error inserting/updating movie ${movie.id}:`, e);
    }
  }

  // fetch remaining pages
  const maxPages = first.total_pages;
  for (let p = 2; p <= maxPages; p++) {
    try {
      console.log(`Fetching page ${p} / ${maxPages}`);
      const pageData = await fetchTmdbPage(p);
      for (const movie of pageData.results) {
        try {
          await Movie.findOneAndUpdate({ id: movie.id }, movie, {
            upsert: true,
            new: true,
          });
        } catch (e) {
          console.error(
            `Error inserting/updating movie ${movie.id} on page ${p}:`,
            e
          );
        }
      }
    } catch (e) {
      console.error(`Error fetching page ${p}:`, e);
    }
  }

  console.log("Done fetching and storing movies.");
}

run().catch((err) => {
  console.error("Run failed:", err);
  process.exit(1);
});
