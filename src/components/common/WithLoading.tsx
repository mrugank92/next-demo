"use client";

import { ComponentType } from "react";
import Loading from "../Loading";

interface WithLoadingProps {
  isLoading: boolean;
  error?: Error | null;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  loadingComponent?: React.ReactNode
) {
  return function WithLoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, error, fallback, errorFallback, ...restProps } = props;

    if (error) {
      return (
        errorFallback || (
          <div className="flex flex-col justify-center items-center px-6 py-36">
            <p className="text-red-500">
              {error.message || "Something went wrong"}
            </p>
          </div>
        )
      );
    }

    if (isLoading) {
      return (
        fallback ||
        loadingComponent || (
          <div className="flex flex-col justify-center items-center px-6 py-36">
            <Loading />
          </div>
        )
      );
    }

    return <WrappedComponent {...(restProps as P)} />;
  };
}