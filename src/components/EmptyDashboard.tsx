import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const EmptyDashboard: React.FC = () => {
  const t = useTranslations("Movie");

  return (
    <section
      className="flex flex-col justify-center items-center px-6 py-64 lg:px-8"
      aria-labelledby="empty-state-heading"
      role="region"
    >
      {/* Animated Icon Container */}
      <div className="fc-animate-scale-in mb-8" aria-hidden="true">
        <div className="relative">
          {/* Movie Film Strip Icon */}
          <div className="w-24 h-24 mx-auto mb-6 fc-animate-pulse">
            <svg
              className="w-full h-full text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Empty movie collection icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 10h6M9 14h6"
              />
              <circle cx="9" cy="8" r="1" fill="currentColor" />
              <circle cx="15" cy="8" r="1" fill="currentColor" />
              <circle cx="9" cy="16" r="1" fill="currentColor" />
              <circle cx="15" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Floating plus icon */}
          <div
            className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center fc-animate-pulse"
            style={{
              animationDelay: "0.5s",
            }}
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="presentation"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div
        className="text-center mb-6 md:mb-10 fc-animate-fade-in"
        style={{
          animationDelay: "0.2s",
        }}
      >
        <h2 id="empty-state-heading" className="heading-two mb-4">
          {t("Your movie list is empty")}
        </h2>
        <p className="body-large text-gray-600 max-w-md mx-auto">
          {t(
            "Start building your personal movie collection by adding your first film"
          )}
        </p>
      </div>

      {/* Enhanced CTA Button */}
      <div
        className="mt-6 md:mt-10 w-full md:w-auto fc-animate-slide-up"
        style={{
          animationDelay: "0.4s",
        }}
      >
        <Link
          href="/add"
          className="custom-button fc-button-hover group relative overflow-hidden focus-ring"
          aria-label={t("Add your first movie to start your collection")}
          aria-describedby="empty-state-heading"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("Add your first movie")}
          </span>

          {/* Shimmer effect on hover */}
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700"
            aria-hidden="true"
          ></div>
        </Link>
      </div>
    </section>
  );
};

// Wrapping with React.memo for performance optimization
const MemoizedEmptyDashboard = React.memo(EmptyDashboard);

// Assigning a displayName for better debugging and readability in React DevTools
MemoizedEmptyDashboard.displayName = "EmptyDashboard";

export default MemoizedEmptyDashboard;
