"use client";

import { deleteCookie } from "cookies-next";
import Link from "next/link";
import React, { useCallback } from "react";
import Languages from "./Languages";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const t = useTranslations("Movie");
  const router = useRouter();

  // Logout handler using useCallback to prevent unnecessary re-creations
  const handleLogout = useCallback(() => {
    try {
      deleteCookie("token");
      router.push("/sign-in"); // Client-side navigation without full reload
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-center">
        <div
          className="w-full max-w-5xl px-3 sm:px-4 md:px-6"
          style={{
            paddingTop: "clamp(1rem, 4vw, 1.5rem)",
            paddingBottom: "clamp(1rem, 4vw, 1.5rem)",
          }}
        >
          <div className="flex justify-between items-center gap-3 sm:gap-4">
            {/* Left Section: Title and Add Button */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <h1 className="heading-two truncate flex-shrink min-w-0">
                {t("My Movies")}
              </h1>
              <Link
                href="/add"
                className="flex items-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md rounded-lg p-2 flex-shrink-0 focus-ring"
                aria-label={t("Add a new movie")}
              >
                <Image
                  src="/plus.svg"
                  width={24}
                  height={24}
                  className="sm:w-8 sm:h-8"
                  alt=""
                  role="presentation"
                  style={{
                    filter:
                      "invert(37%) sepia(93%) saturate(590%) hue-rotate(122deg) brightness(98%) contrast(89%)",
                  }}
                />
                <span className="visually-hidden">{t("Add a new movie")}</span>
              </Link>
            </div>

            {/* Right Section: Languages and Logout */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Languages />
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm focus-ring hover:outline-green-300 min-h-touch-target"
              >
                <span className="body-regular hidden sm:inline text-xs sm:text-sm whitespace-nowrap">
                  {t("logout")}
                </span>
                <Image
                  src="/logout.svg"
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                  alt=""
                  role="presentation"
                  style={{
                    filter:
                      "invert(37%) sepia(93%) saturate(590%) hue-rotate(122deg) brightness(98%) contrast(89%)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
