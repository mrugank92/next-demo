import { z } from 'zod';

/**
 * Validation schema for genre
 */
const genreSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Genre name is required'),
});

/**
 * Validation schema for creating/updating a movie
 */
export const movieSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  overview: z.string()
    .min(10, 'Overview must be at least 10 characters')
    .max(5000, 'Overview must be less than 5000 characters'),
  year: z.number()
    .int('Year must be an integer')
    .min(1888, 'Year must be 1888 or later') // First movie was made in 1888
    .max(new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future'),
  release_date: z.string().optional(),
  popularity: z.number()
    .min(0, 'Popularity must be at least 0')
    .max(100, 'Popularity must be at most 100'),
  vote_average: z.number()
    .min(0, 'Rating must be at least 0')
    .max(10, 'Rating must be at most 10'),
  vote_count: z.number()
    .int('Vote count must be an integer')
    .min(0, 'Vote count must be at least 0'),
  runtime: z.number()
    .int('Runtime must be an integer')
    .min(0, 'Runtime must be at least 0')
    .max(1000, 'Runtime must be less than 1000 minutes')
    .optional(),
  genres: z.array(genreSchema)
    .min(1, 'At least one genre is required')
    .max(10, 'Maximum 10 genres allowed'),
  link: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  image: z.string().optional(),
  poster_path: z.string().optional(),
  backdrop_path: z.string().optional(),
  credits: z.object({
    cast: z.array(z.any()),
    crew: z.array(z.any()),
  }).optional(),
  directors: z.array(z.any()).optional(),
});

/**
 * Validation schema for movie ID parameter
 */
export const movieIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid movie ID format'),
});

/**
 * Validation schema for pagination query params
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'year', 'vote_average', 'popularity']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type MovieInput = z.infer<typeof movieSchema>;
export type MovieIdInput = z.infer<typeof movieIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;