"use client";

import { useEffect, useRef, ReactNode } from "react";

interface InfiniteScrollRendererProps<T> {
  items: T[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: (items: T[]) => ReactNode;
  threshold?: number;
  loadingComponent?: ReactNode;
}

export function InfiniteScrollRenderer<T>({
  items,
  hasMore,
  loading,
  onLoadMore,
  children,
  threshold = 100,
  loadingComponent,
}: InfiniteScrollRendererProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <>
      {children(items)}
      {hasMore && (
        <div ref={sentinelRef} className="h-4">
          {loading && (loadingComponent || <div>Loading more...</div>)}
        </div>
      )}
    </>
  );
}