import mongoose, { Schema } from "mongoose";
import { number, string, z } from "zod";

export const movieSchemaZod = z.object({
  id: number().optional(),
  title: string(),
  overview: string().optional(),
  popularity: number().optional(),
  release_date: string().optional(),
  poster_path: string().nullable().optional(),
  backdrop_path: string().nullable().optional(),
  vote_average: number().optional(),
  vote_count: number().optional(),
  // User-added fields
  image: string().optional(),
  year: number().optional(),
  link: string().optional(),
});

const movieSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    popularity: {
      type: Number,
      required: true,
    },
    release_date: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      default: null,
    },
    backdrop_path: {
      type: String,
      default: null,
    },
    vote_average: {
      type: Number,
      required: true,
    },
    vote_count: {
      type: Number,
      required: true,
    },
    // Keep the original fields for user-added movies
    image: {
      type: String,
    },
    year: {
      type: Number,
    },
    link: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
