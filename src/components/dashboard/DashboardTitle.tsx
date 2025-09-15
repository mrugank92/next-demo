"use client";

import Image from "next/image";
import Link from "next/link";

interface DashboardTitleProps {
  title?: string;
  showAddButton?: boolean;
}

export default function DashboardTitle({
  title = "Movie Collection",
  showAddButton = true,
}: DashboardTitleProps) {
  return (
    <div className="flex items-center gap-1 mb-2">
      <h2
        id="movies-heading"
        className="text-3xl font-bold text-gray-900 mb-2"
      >
        {title}
      </h2>
      {showAddButton && (
        <Link
          href="/add"
          className="flex items-center transition-all duration-200 ease-in-out hover:scale-105 rounded-lg p-1 flex-shrink-0 focus-ring"
        >
          <Image
            src="/plus.svg"
            width={15}
            height={15}
            className="sm:w-6 sm:h-6 mb-1"
            alt=""
            role="presentation"
            style={{
              filter:
                "invert(37%) sepia(93%) saturate(590%) hue-rotate(122deg) brightness(98%) contrast(89%)",
            }}
          />
        </Link>
      )}
    </div>
  );
}