"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useTransition } from "react";
import { setCookie } from "cookies-next";
import { setUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { AuthResponse } from "@/types/common";
import { toast } from "react-toastify";

/**
 * Interface for form data state
 */
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * SignInForm Component
 *
 * Handles user authentication by capturing email and password inputs,
 * sending a sign-in request, handling responses, and managing authentication tokens.
 */
const SignInForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    email: "user@gmail.com",
    password: "mymovies",
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
   * Handles the form submission for user login.
   * Utilizes useCallback to memoize the function and prevent unnecessary re-creations.
   * Manages loading state using useTransition for a smooth user experience.
   */
  const handleLogin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      // Start transition for loading state
      startTransition(async () => {
        try {
          const response = await axios.post<AuthResponse>("/api/auth/sign-in", {
            email: formData.email,
            password: formData.password,
          });

          if (response.status === 200) {
            const { token, user } = response.data.data;

            // Set authentication token as a cookie
            setCookie("token", token, {
              path: "/",
              maxAge: 60 * 60 * 24, // 1 day
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
            });

            // Dispatch user information to Redux store
            setCookie("userId", user._id, {
              path: "/",
              maxAge: 60 * 60 * 24, // 1 day
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
            });
            dispatch(setUser({ userId: user._id, email: user.email }));

            // Show welcome back toast
            toast.success(
              "Welcome back! You have been successfully signed in.",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );

            // Navigate to the home page
            router.replace("/");
          }
        } catch (err) {
          console.error("Login Error:", err);
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.data?.message || "An error occurred during login."
            );
          } else {
            setError("An unexpected error occurred during login.");
          }
        }
      });
    },
    [formData, dispatch, router]
  );

  return (
    <div>
      <form className="space-y-6" onSubmit={handleLogin} noValidate>
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
            placeholder="admin@school.com"
            required
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              error ? "border-red-500" : ""
            }`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
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
            placeholder="••••••••••"
            required
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              error ? "border-red-500" : ""
            }`}
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "password-error" : undefined}
          />
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              aria-label="Remember me"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
            role="alert"
            id="email-error"
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default React.memo(SignInForm);
