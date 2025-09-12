import { isAuth } from "@/libs/Auth";
import connectMongoDB from "@/libs/dbConnect";
import Movie, { movieSchemaZod } from "@/models/movie";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *         - Movie
 *     summary: Get all movies
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *       404:
 *         description: No movies found
 *       500:
 *         description: Something went wrong
 */
export async function GET(req: NextRequest) {
  const userId = await isAuth(req);
  if (!userId) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized You Must Login First",
        success: false,
      },
      { status: 401 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    await connectMongoDB();

    // Get both TMDB movies (no userId) and user-specific movies
    const userMovieCount = await Movie.countDocuments({ userId });
    const tmdbMovieCount = await Movie.countDocuments({
      userId: { $exists: false },
    });
    const totalCount = userMovieCount + tmdbMovieCount;

    // Fetch movies with mixed results (TMDB + user movies)
    const skip = (page - 1) * pageSize;

    // Get TMDB movies first, then user movies
    const tmdbMovies = await Movie.find({ userId: { $exists: false } })
      .skip(Math.max(0, skip))
      .limit(pageSize)
      .sort({ _id: -1 });

    let userMovies = [];
    const remainingSlots = pageSize - tmdbMovies.length;

    if (remainingSlots > 0 && skip < tmdbMovieCount) {
      // If we need more movies and haven't exhausted TMDB movies, get more TMDB
      const additionalTmdb = await Movie.find({ userId: { $exists: false } })
        .skip(skip + tmdbMovies.length)
        .limit(remainingSlots)
        .sort({ _id: -1 });
      tmdbMovies.push(...additionalTmdb);
    } else if (remainingSlots > 0) {
      // Get user movies if we still have slots
      const userSkip = Math.max(0, skip - tmdbMovieCount);
      userMovies = await Movie.find({ userId })
        .skip(userSkip)
        .limit(remainingSlots)
        .sort({ _id: -1 });
    }

    const movies = [...tmdbMovies, ...userMovies];

    if (!movies || movies.length === 0) {
      return NextResponse.json(
        { data: [], message: "No movies found", success: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        data: movies,
        totalData: totalCount,
        message: "Movies retrieved successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags:
 *        - Movie
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie created successfully
 *       404:
 *         description: Invalid inputs
 *       500:
 *         description: Something went wrong
 */
export async function POST(req: NextRequest) {
  const userId = await isAuth(req);

  if (!userId) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized You Must Login First",
        success: false,
      },
      { status: 401 }
    );
  }
  try {
    await connectMongoDB();
    const { title, year, image, link } = await req.json();
    const movieData = movieSchemaZod.pick({
      title: true,
      year: true,
      image: true,
      link: true,
    });
    const { success, error } = movieData.safeParse({
      title,
      year,
      image,
      link,
    });
    if (!success) {
      return NextResponse.json(
        { data: [error], message: "Invalid inputs", success: false },
        { status: 404 }
      );
    }

    const movie = await Movie.create({ title, year, image, link, userId });
    return NextResponse.json(
      { data: movie, message: "Movie created successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: error, message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
