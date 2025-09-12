"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { AuthResponse } from "@/types/common";
import { toast } from "react-toastify";

/**
 * Interface for form data state
 */
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

/**
 * SignUpForm Component
 *
 * Handles user registration by capturing email, password, and confirm password inputs,
 * sending a sign-up request, handling responses, and managing authentication tokens.
 */
const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /**
   * Handles input changes for the form fields.
   * Utilizes useCallback to memoize the function and prevent unnecessary re-creations.
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    []
  );

  /**
   * Handles the form submission for user registration.
   * Utilizes useCallback to memoize the function and prevent unnecessary re-creations.
   * Manages loading state using useTransition for a smooth user experience.
   */
  const handleSignUp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      // Start transition for loading state
      startTransition(async () => {
        // Basic client-side validation for password match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        try {
          const response = await axios.post<AuthResponse>("/api/auth/sign-up", {
            email: formData.email,
            password: formData.password,
          });

          if (response.status === 200) {
            // Show success toast
            toast.success(
              "Registration completed successfully! Please sign in to continue.",
              {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );

            // Navigate to the sign-in page
            setTimeout(() => {
              router.replace("/sign-in");
            }, 1000); // Small delay to ensure toast is visible
          }
        } catch (err) {
          console.error("Sign Up Error:", err);
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.message || "An error occurred during sign up."
            );
          } else {
            setError("An unexpected error occurred during sign up.");
          }
        }
      });
    },
    [formData, router]
  );

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSignUp} noValidate>
        {/* Email Field */}
        <div className="fc-form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              error ? "border-red-500" : ""
            }`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "form-error" : undefined}
          />
        </div>

        {/* Password Field */}
        <div className="fc-form-group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            required
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              error ? "border-red-500" : ""
            }`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "form-error" : undefined}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="fc-form-group">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              error ? "border-red-500" : ""
            }`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "form-error" : undefined}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 mt-1"
            aria-label="Accept terms"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
            I agree to the{" "}
            <span className="text-emerald-600 hover:text-emerald-500 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-emerald-600 hover:text-emerald-500 cursor-pointer">
              Privacy Policy
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
            role="alert"
            id="form-error"
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="fc-form-group">
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default React.memo(SignUpForm);
