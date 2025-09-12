import { isAuth } from "@/libs/Auth";
import connectMongoDB from "@/libs/dbConnect";
import Movie from "@/models/movie";
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
    const pageSize = 15;
    await connectMongoDB();

    // Get both TMDB movies (no userId) and user-specific movies
    const totalCount = await Movie.countDocuments();

    // Simple approach: Get all movies with user movies prioritized
    const skip = (page - 1) * pageSize;

    // Get all movies sorted by latest first (reverse order - index -1)
    const movies = await Movie.find({})
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 });

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
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               year:
 *                 type: integer
 *               release_date:
 *                 type: string
 *               runtime:
 *                 type: number
 *               genres:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *               popularity:
 *                 type: number
 *               vote_average:
 *                 type: number
 *               vote_count:
 *                 type: number
 *               poster_path:
 *                 type: string
 *               backdrop_path:
 *                 type: string
 *               image:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie created successfully
 *       401:
 *         description: Unauthorized - Must login first
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
    const body = await req.json();

    // Extract all fields from the request body
    const {
      id,
      title,
      overview,
      popularity,
      release_date,
      runtime,
      genres,
      poster_path,
      backdrop_path,
      vote_average,
      vote_count,
      credits,
      directors,
      image,
      year,
      link,
    } = body;

    // Create movie with all fields and userId
    const movie = await Movie.create({
      id: id || Date.now(), // Use provided ID or generate one
      title,
      overview: overview || "",
      popularity: popularity || 0,
      release_date: release_date || new Date().toISOString().split("T")[0],
      runtime: runtime || null,
      genres: genres || [],
      poster_path: poster_path || null,
      backdrop_path: backdrop_path || null,
      vote_average: vote_average || 0,
      vote_count: vote_count || 0,
      credits: credits || { cast: [], crew: [] },
      directors: directors || [],
      image,
      year,
      link,
      userId, // Attach the userId from authentication
      lastSyncedAt: new Date(),
    });

    return NextResponse.json(
      { data: movie, message: "Movie created successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { data: error, message: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
