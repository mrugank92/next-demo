"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";
import { useNetworkState } from "@/hooks/useNetworkState";

interface SwrProviderProps {
  children: ReactNode;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.message = response.statusText;
    throw error;
  }
  
  return response.json();
};

export default function SwrProvider({ children }: SwrProviderProps) {
  const { isOnline } = useNetworkState();

  return (
    <SWRConfig
      value={{
        fetcher,
        // Network-aware revalidation
        revalidateOnFocus: isOnline,
        revalidateOnReconnect: true,
        revalidateIfStale: isOnline,
        // Refresh interval (optional, can be overridden per hook)
        refreshInterval: isOnline ? 0 : 0,
        // Error retry with network awareness
        errorRetryCount: isOnline ? 3 : 0,
        errorRetryInterval: 5000,
        // Deduplication interval
        dedupingInterval: 2000,
        // Focus throttle interval
        focusThrottleInterval: 5000,
        // Network-aware data fetching
        onError: (error) => {
          if (!isOnline) {
            console.warn("Network request failed while offline:", error);
          }
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Don't retry if offline
          if (!isOnline) return;
          
          // Don't retry on 404
          if (error?.status === 404) return;
          
          // Only retry up to 3 times
          if (retryCount >= 3) return;
          
          // Retry after 5 seconds
          setTimeout(() => revalidate({ retryCount }), 5000);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}