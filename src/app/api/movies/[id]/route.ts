/* eslint-disable @typescript-eslint/no-explicit-any */
import connectMongoDB from "@/libs/dbConnect";
import Movie, { movieSchemaZod } from "@/models/movie";
import { NextRequest, NextResponse } from "next/server";
import { isAuth } from "@/libs/Auth";
import { validateRequest } from "@/utils/validateRequest";
import { formatResponse } from "@/utils/responseFormatter";
import logger from "@/libs/logger";
import {
  DeleteMovieResponse,
  GetMovieResponse,
  UpdateMovieResponse,
} from "@/types/common";

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Get a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMovieResponse'
 *       401:
 *         description: Unauthorized - You must log in first
 *       404:
 *         description: Movie not found
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Something went wrong
 *   patch:
 *     tags:
 *       - Movie
 *     summary: Update a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovieRequest'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateMovieResponse'
 *       400:
 *         description: Invalid inputs
 *       401:
 *         description: Unauthorized - You must log in first
 *       404:
 *         description: Movie not found
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Something went wrong
 *   delete:
 *     tags:
 *       - Movie
 *     summary: Delete a movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteMovieResponse'
 *       401:
 *         description: Unauthorized - You must log in first
 *       404:
 *         description: Movie not found
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Something went wrong
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GetMovieResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Movie'
 *     UpdateMovieRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         year:
 *           type: number
 *         image:
 *           type: string
 *           format: uri
 *     UpdateMovieResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Movie'
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 *     DeleteMovieResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/Movie'
 */

// GET Handler: Retrieve a Movie by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetMovieResponse>> {
  try {
    // Authenticate the user
    const userId = await isAuth(req);
    if (!userId) {
      logger.warn("Unauthorized access attempt to GET /api/movies/{id}");
      return formatResponse<undefined>(
        { message: "Unauthorized. You must log in first.", success: false },
        401
      );
    }// Connect to MongoDB
    await connectMongoDB();

    const { id } = await params;

    // Validate ID format (optional, but recommended)
    logger.info(`Attempting to fetch movie with ID: ${id}`);
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn(`Invalid movie ID format: ${id}`);
      return formatResponse<undefined>(
        { message: "Invalid movie ID format.", success: false },
        400
      );
    }

    // Retrieve the movie
    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      logger.warn(`Movie not found for ID: ${id}, User: ${userId}`);
      return formatResponse<undefined>(
        { message: "Movie not found.", success: false },
        404
      );
    }

    logger.info(`Movie found successfully for ID: ${id}`);

    // Transform movie to ensure proper serialization
    const transformedMovie = {
      _id: movie._id.toString(),
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      runtime: movie.runtime,
      genres: movie.genres?.map((genre: { id: number; name: string }) => ({
        id: genre.id,
        name: genre.name
      })) || [],
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      credits: movie.credits,
      directors: movie.directors,
      images: movie.images,
      videos: movie.videos,
      lastSyncedAt: movie.lastSyncedAt?.toISOString(),
      image: movie.image,
      year: movie.year,
      link: movie.link,
      userId: movie.userId?.toString(),
      createdAt: movie.createdAt?.toISOString(),
      updatedAt: movie.updatedAt?.toISOString(),
    };

    return formatResponse(
      { message: "Movie found.", success: true, data: transformedMovie },
      200
    );
  } catch (error) {
    logger.error("GET /api/movies/{id} Error:", error);
    return formatResponse<undefined>(
      { message: "Something went wrong.", success: false },
      500
    );
  }
}

// PATCH Handler: Update a Movie by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateMovieResponse>> {
  try {
    // Authenticate the user
    const userId = await isAuth(req);
    if (!userId) {
      logger.warn("Unauthorized access attempt to PATCH /api/movies/{id}");
      return formatResponse<undefined>(
        { message: "Unauthorized. You must log in first.", success: false },
        401
      );
    }// Connect to MongoDB
    await connectMongoDB();

    const { id } = await params;

    // Validate ID format (optional)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return formatResponse<undefined>(
        { message: "Invalid movie ID format.", success: false },
        400
      );
    }

    // Validate request body using Zod
    const validation = await validateRequest(
      req,
      movieSchemaZod.pick({ title: true, year: true, image: true })
    );
    if (!validation.success) {
      logger.warn(
        `Validation failed for PATCH /api/movies/{id}: ${JSON.stringify(
          validation.errors?.errors
        )}`
      );
      return formatResponse<undefined>(
        {
          message: "Invalid inputs.",
          success: false,
          errors: validation.errors?.errors,
        },
        400
      );
    }

    const { title, year, image } = validation.data!;

    // Update the movie
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: id, userId },
      { title, year, image },
      { new: true }
    );

    if (!updatedMovie) {
      return formatResponse<undefined>(
        {
          message: "Movie not found or not authorized to update.",
          success: false,
        },
        404
      );
    }

    // Transform updated movie to ensure proper serialization
    const transformedUpdatedMovie = {
      _id: updatedMovie._id.toString(),
      id: updatedMovie.id,
      title: updatedMovie.title,
      overview: updatedMovie.overview,
      popularity: updatedMovie.popularity,
      release_date: updatedMovie.release_date,
      runtime: updatedMovie.runtime,
      genres: updatedMovie.genres?.map((genre: any) => ({
        id: genre.id,
        name: genre.name
      })) || [],
      poster_path: updatedMovie.poster_path,
      backdrop_path: updatedMovie.backdrop_path,
      vote_average: updatedMovie.vote_average,
      vote_count: updatedMovie.vote_count,
      credits: updatedMovie.credits,
      directors: updatedMovie.directors,
      images: updatedMovie.images,
      videos: updatedMovie.videos,
      lastSyncedAt: updatedMovie.lastSyncedAt?.toISOString(),
      image: updatedMovie.image,
      year: updatedMovie.year,
      link: updatedMovie.link,
      userId: updatedMovie.userId?.toString(),
      createdAt: updatedMovie.createdAt?.toISOString(),
      updatedAt: updatedMovie.updatedAt?.toISOString(),
    };

    return formatResponse(
      {
        message: "Movie updated successfully.",
        success: true,
        data: transformedUpdatedMovie,
      },
      200
    );
  } catch (error) {
    logger.error("PATCH /api/movies/{id} Error:", error);
    return formatResponse<undefined>(
      { message: "Something went wrong.", success: false },
      500
    );
  }
}

// DELETE Handler: Delete a Movie by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteMovieResponse>> {
  try {
    // Authenticate the user
    const userId = await isAuth(req);
    if (!userId) {
      logger.warn("Unauthorized access attempt to DELETE /api/movies/{id}");
      return formatResponse<undefined>(
        { message: "Unauthorized. You must log in first.", success: false },
        401
      );
    }// Connect to MongoDB
    await connectMongoDB();

    const { id } = await params;

    // Validate ID format (optional)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return formatResponse<undefined>(
        { message: "Invalid movie ID format.", success: false },
        400
      );
    }

    // Delete the movie
    const deletedMovie = await Movie.findOneAndDelete({ _id: id, userId });
    if (!deletedMovie) {
      return formatResponse<undefined>(
        {
          message: "Movie not found or not authorized to delete.",
          success: false,
        },
        404
      );
    }

    // Transform deleted movie to ensure proper serialization
    const transformedDeletedMovie = {
      _id: deletedMovie._id.toString(),
      id: deletedMovie.id,
      title: deletedMovie.title,
      overview: deletedMovie.overview,
      popularity: deletedMovie.popularity,
      release_date: deletedMovie.release_date,
      runtime: deletedMovie.runtime,
      genres: deletedMovie.genres?.map((genre: any) => ({
        id: genre.id,
        name: genre.name
      })) || [],
      poster_path: deletedMovie.poster_path,
      backdrop_path: deletedMovie.backdrop_path,
      vote_average: deletedMovie.vote_average,
      vote_count: deletedMovie.vote_count,
      credits: deletedMovie.credits,
      directors: deletedMovie.directors,
      images: deletedMovie.images,
      videos: deletedMovie.videos,
      lastSyncedAt: deletedMovie.lastSyncedAt?.toISOString(),
      image: deletedMovie.image,
      year: deletedMovie.year,
      link: deletedMovie.link,
      userId: deletedMovie.userId?.toString(),
      createdAt: deletedMovie.createdAt?.toISOString(),
      updatedAt: deletedMovie.updatedAt?.toISOString(),
    };

    return formatResponse(
      {
        message: "Movie deleted successfully.",
        success: true,
        data: transformedDeletedMovie,
      },
      200
    );
  } catch (error) {
    logger.error("DELETE /api/movies/{id} Error:", error);
    return formatResponse<undefined>(
      { message: "Something went wrong.", success: false },
      500
    );
  }
}
