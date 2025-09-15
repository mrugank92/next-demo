"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Languages from "../Languages";

export default function UserActions() {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    try {
      deleteCookie("token");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <Languages />
      <button
        onClick={handleLogout}
        className="flex items-center cursor-pointer gap-1 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm focus-ring min-h-touch-target"
      >
        <span className="body-regular hidden sm:inline text-xs sm:text-sm whitespace-nowrap">
          Logout
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
  );
}