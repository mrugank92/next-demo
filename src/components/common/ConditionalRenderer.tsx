"use client";

import { ReactNode } from "react";

interface ConditionalRendererProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ConditionalRenderer({
  condition,
  children,
  fallback = null,
}: ConditionalRendererProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

interface ListRendererProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  emptyState?: ReactNode;
  loading?: boolean;
  loadingState?: ReactNode;
}

export function ListRenderer<T>({
  items,
  renderItem,
  keyExtractor,
  emptyState,
  loading,
  loadingState,
}: ListRendererProps<T>) {
  if (loading) {
    return <>{loadingState}</>;
  }

  if (items.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
    </>
  );
}