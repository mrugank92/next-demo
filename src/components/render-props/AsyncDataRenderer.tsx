"use client";

import { ReactNode } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface AsyncDataRendererProps<T> {
  children: (state: AsyncState<T>) => ReactNode;
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function AsyncDataRenderer<T>({
  children,
  data,
  loading,
  error,
}: AsyncDataRendererProps<T>) {
  return <>{children({ data, loading, error })}</>;
}

interface AsyncDataWithStatesProps<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error) => ReactNode;
  emptyComponent?: ReactNode;
  children: (data: T) => ReactNode;
}

export function AsyncDataWithStates<T>({
  data,
  loading,
  error,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}: AsyncDataWithStatesProps<T>) {
  if (loading) {
    return loadingComponent || <div>Loading...</div>;
  }

  if (error) {
    return errorComponent ? errorComponent(error) : <div>Error: {error.message}</div>;
  }

  if (!data) {
    return emptyComponent || <div>No data available</div>;
  }

  return <>{children(data)}</>;
}