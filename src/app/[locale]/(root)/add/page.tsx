/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Movie } from "@/types/common";
import { useMovieMutations } from "@/hooks/useMovieMutations";

export default function Page() {
  const router = useRouter();
  const { createMovie } = useMovieMutations();
  const [formData, setFormData] = useState<Movie>({
    title: "",
    year: 2024,
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Add");

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
   * Handles form submission to create a new movie.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!base64Image) {
      setImageError("Image is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = {
        ...formData,
        image: base64Image,
        year: formData.year && parseInt(formData.year.toString(), 10),
      };

      await createMovie(formDataToSend);
      router.push("/");
    } catch (error) {
      console.log("Error submitting form:", error);
      setImageError("Failed to create movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fc-page-container">
      <div className="fc-main-content">
        <div className="fc-container-narrow">
          <h2 className="heading-two pb-12 text-center">
            {t("Create a new movie")}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-12"
          >
            {/* Image Upload Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <label className="fc-form-label mb-4">Movie Poster</label>
              <div
                className={`fc-file-upload h-80 lg:h-96 rounded-lg relative ${
                  imagePreview ? "border-solid border-gray-200" : ""
                }`}
              >
                <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer relative">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Selected Movie Poster"
                        className="object-cover h-full w-full rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label="Clear selected image"
                      >
                        <svg
                          className="w-4 h-4"
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
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span className="text-gray-600 text-base font-medium mb-2">
                        {t("Drop an image here")}
                      </span>
                      <span className="text-gray-400 text-sm">
                        or click to browse
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </>
                  )}
                </label>
                {imageError && (
                  <div className="fc-form-error mt-2">{imageError}</div>
                )}
              </div>
            </div>

            {/* Form Inputs Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              {/* Title Input */}
              <div className="fc-form-group">
                <label htmlFor="title" className="fc-form-label">
                  {t("Title")}
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder={t("Enter movie title")}
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Year Input */}
              <div className="fc-form-group">
                <label htmlFor="year" className="fc-form-label">
                  {t("Publishing Year")}
                </label>
                <input
                  id="year"
                  name="year"
                  placeholder={t("Enter publishing year")}
                  value={formData.year}
                  onChange={handleChangeYear}
                  required
                  pattern="\d{4}"
                  maxLength={4}
                  className="input-field max-w-48"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/" className="custom-button secondary flex-1">
                  {t("Cancel")}
                </Link>
                <button
                  type="submit"
                  className="custom-button flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="fc-spinner mr-2"
                        aria-hidden="true"
                      ></span>
                      {t("Creating...")}
                    </>
                  ) : (
                    t("Submit")
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
