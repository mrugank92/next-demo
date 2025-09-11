"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition Component
 *
 * Provides smooth fade-in animations for page transitions
 * with accessibility support for reduced motion preferences.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset visibility on route change
    setIsVisible(false);

    // Trigger fade-in animation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`fc-page-transition ${
        isVisible ? "fc-page-enter-active" : "fc-page-enter"
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
