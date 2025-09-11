"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useTransition, useCallback } from "react";
import { useLocale } from "use-intl";

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
];

const Languages: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();

  /**
   * Handles the change event for the language selector.
   * Uses useCallback to memoize the function and prevent unnecessary re-creations.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = event.target.value;
      startTransition(() => {
        // Navigate to the new locale's root, replacing the current path
        router.replace(`/${nextLocale}`);
      });
    },
    [router]
  );

  return (
    <div className="relative flex items-center">
      <label htmlFor="language-select" className="visually-hidden">
        Select Language
      </label>
      <select
        className={`
          appearance-none body-small 
          px-3 py-2 rounded-md  
          transition-all duration-200 ease-in-out
          bg-white border border-gray-300 text-gray-700
          w-20 sm:w-24 min-h-touch-target
          focus:outline-none focus:ring-1 focus:ring-black
          hover:border-gray-400 hover:shadow-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          pr-7 text-sm font-medium
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.2em 1.2em",
        }}
        id="language-select"
        value={currentLocale}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Language selector"
      >
        {languageOptions.map(({ value, label }) => (
          <option key={value} value={value} className="text-sm font-medium">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Languages);
