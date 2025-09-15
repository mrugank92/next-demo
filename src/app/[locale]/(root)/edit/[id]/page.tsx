/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMovieById } from "@/hooks/useMovies";
import { useMovieMutations } from "@/hooks/useMovieMutations";
import { toast } from "react-toastify";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { updateMovie } = useMovieMutations();
  const {
    movie,
    isLoading: movieLoading,
    isError,
  } = useMovieById(id as string);
  const [formData, setFormData] = useState<{
    title: string;
    overview: string;
    year: number;
    release_date: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    runtime: number;
    genres: Array<{ id: number; name: string }>;
    link: string;
    image: string;
    poster_path?: string;
    backdrop_path?: string;
  }>({
    title: "",
    overview: "",
    year: new Date().getFullYear(),
    release_date: "",
    popularity: 0,
    vote_average: 0,
    vote_count: 0,
    runtime: 0,
    genres: [],
    link: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  const t = useTranslations("Add");

  // Update form data when movie data is loaded
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        overview: movie.overview || "",
        year: movie.year
          ? parseInt(movie.year.toString())
          : new Date().getFullYear(),
        release_date: movie.release_date || "",
        popularity: movie.popularity || 0,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        runtime: movie.runtime || 0,
        genres: movie.genres || [],
        link: movie.link || "",
        image: movie.image || "",
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
      });
      setImagePreview(movie.image || null);
    }
  }, [movie]);

  /**
   * Handles changes in text input fields.
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles changes in the year input field, ensuring only digits are entered.
   */
  const handleChangeYear = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    }
  };

  /**
   * Handles adding a genre to the list
   */
  const handleAddGenre = () => {
    if (genreInput.trim()) {
      const newGenre = {
        id: Date.now(), // Generate a temporary ID
        name: genreInput.trim(),
      };
      setFormData({
        ...formData,
        genres: [...formData.genres, newGenre],
      });
      setGenreInput("");
    }
  };

  /**
   * Handles removing a genre from the list
   */
  const handleRemoveGenre = (genreId: number) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((g) => g.id !== genreId),
    });
  };

  /**
   * Handles numeric input changes
   */
  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, [name]: numValue });
  };

  /**
   * Handles image file selection and uploads the image to the server.
   */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageError(null);
      };

      reader.readAsDataURL(file);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const data = await response.json();
        setBase64Image(data.data); // Assuming 'data.data' contains the base64 string
      } catch (error) {
        console.error("Error uploading image:", error);
        setImageError("Failed to upload image. Please try again.");
      }
    }
  };

  /**
   * Clears the selected image from the form.
   */
  const clearImage = () => {
    setImagePreview(null);
    setBase64Image(null);
    setImageError(null);
  };

  /**
   * Handles form submission to update the movie details.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSubmitError(null); // Clear any previous errors

    try {
      const formDataToSend = {
        ...formData,
        image: base64Image || formData.image,
        year: formData.year && parseInt(formData.year.toString(), 10),
        runtime: formData.runtime
          ? parseInt(formData.runtime.toString(), 10)
          : undefined,
        popularity: parseFloat(formData.popularity.toString()) || 0,
        vote_average: parseFloat(formData.vote_average.toString()) || 0,
        vote_count: parseInt(formData.vote_count.toString(), 10) || 0,
        poster_path: formData.poster_path || undefined,
        backdrop_path: formData.backdrop_path || undefined,
      };

      await updateMovie(id as string, formDataToSend);
      toast.success("Movie updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update movie. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (movieLoading) {
    return (
      <div className="fc-page-container">
        <div className="flex justify-center items-center h-64">
          <div className="fc-spinner w-12 h-12 text-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="fc-page-container">
        <div className="flex justify-center items-center h-64">
          <p className="fc-form-error text-center">Failed to load movie data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("Edit")} Movie
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Poster Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Movie Poster
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl h-80 transition-colors ${
                    imagePreview
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  } relative overflow-hidden`}
                >
                  <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer relative group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Movie Poster Preview"
                          className="object-cover h-full w-full rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={clearImage}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 transform scale-90 group-hover:scale-100"
                            aria-label="Remove image"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-600 mb-2">
                          Drop an image here
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {imageError && (
                  <div className="text-red-500 text-sm font-medium mt-2 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {imageError}
                  </div>
                )}
              </div>

              {/* Middle Column - Basic Info */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter movie title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-colors"
                  />
                </div>

                {/* Overview */}
                <div>
                  <label
                    htmlFor="overview"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Overview
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    placeholder="Enter movie overview/description"
                    value={formData.overview}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors resize-none"
                  />
                </div>

                {/* Year and Release Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Publishing Year
                    </label>
                    <input
                      id="year"
                      name="year"
                      placeholder="2024"
                      value={formData.year}
                      onChange={handleChangeYear}
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="release_date"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Release Date
                    </label>
                    <input
                      id="release_date"
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  transition-colors"
                    />
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Genres
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add genre (e.g., Action, Drama)"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGenre();
                        }
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddGenre}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      +
                    </button>
                  </div>
                  {formData.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {genre.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveGenre(genre.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-6">
                {/* Rating Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="popularity"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Popularity
                    </label>
                    <input
                      id="popularity"
                      type="number"
                      name="popularity"
                      placeholder="0-100"
                      value={formData.popularity}
                      onChange={handleNumericChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vote_average"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Rating
                    </label>
                    <input
                      id="vote_average"
                      type="number"
                      name="vote_average"
                      placeholder="0-10"
                      value={formData.vote_average}
                      onChange={handleNumericChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="vote_count"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Votes
                    </label>
                    <input
                      id="vote_count"
                      type="number"
                      name="vote_count"
                      placeholder="Number of votes"
                      value={formData.vote_count}
                      onChange={handleNumericChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="runtime"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Runtime (min)
                    </label>
                    <input
                      id="runtime"
                      type="number"
                      name="runtime"
                      placeholder="Minutes"
                      value={formData.runtime}
                      onChange={handleNumericChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                    />
                  </div>
                </div>

                {/* External Link */}
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    External Link{" "}
                    <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input
                    id="link"
                    type="url"
                    name="link"
                    placeholder="https://example.com/movie"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  placeholder-gray-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* General Error Message */}
            {submitError && (
              <div className="text-red-500 text-sm font-medium mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {submitError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
              >
                {t("Cancel")}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("Updating...")}
                  </>
                ) : (
                  t("Update")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
