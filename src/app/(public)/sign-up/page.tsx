import SignUpForm from "@/components/forms/SignUpFrom";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logo/Brand */}
          <div className="flex items-center mb-16">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MovieFlix</h1>
              <p className="text-green-200 text-sm">Cinema Management System</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Unlimited Movie Access
                </h3>
                <p className="text-green-200 text-sm">
                  Access thousands of movies, create personal watchlists, and
                  discover new favorites with our smart recommendation engine
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Personal Collection
                </h3>
                <p className="text-green-200 text-sm">
                  Build your personal movie library, rate films, write reviews,
                  and share your favorite collections with friends
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-teal-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  HD Quality Streaming
                </h3>
                <p className="text-green-200 text-sm">
                  Enjoy crystal-clear HD quality, multiple device sync, and
                  offline downloads for the ultimate viewing experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 border-t border-green-300/20 pt-8">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-200 text-sm">Free to Join</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-200 text-sm">Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-200 text-sm">No Ads</span>
            </div>
          </div>
          <p className="text-green-300 text-sm mt-4">
            Join <span className="font-semibold">50,000+</span> movie
            enthusiasts worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MovieFlix</h1>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join MovieFlix
            </h2>
            <p className="text-gray-600">
              Create your account and start building your{" "}
              <span className="font-semibold text-emerald-600">
                movie collection
              </span>
            </p>
          </div>

          {/* Form */}
          <SignUpForm />

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
