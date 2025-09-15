"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface VisibilityRendererProps {
  children: (isVisible: boolean) => ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function VisibilityRenderer({
  children,
  threshold = 0,
  rootMargin = "0px",
  triggerOnce = false,
}: VisibilityRendererProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyVisible = entry.isIntersecting;
        setIsVisible(isCurrentlyVisible);

        if (isCurrentlyVisible && triggerOnce && !hasTriggered) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return (
    <div ref={elementRef}>
      {children(triggerOnce ? hasTriggered || isVisible : isVisible)}
    </div>
  );
}

interface LazyRendererProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function LazyRenderer({
  children,
  fallback = null,
  threshold = 0,
  rootMargin = "100px",
}: LazyRendererProps) {
  return (
    <VisibilityRenderer
      threshold={threshold}
      rootMargin={rootMargin}
      triggerOnce
    >
      {(isVisible) => (isVisible ? children : fallback)}
    </VisibilityRenderer>
  );
}