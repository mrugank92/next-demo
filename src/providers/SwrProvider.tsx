"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

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
  return (
    <SWRConfig
      value={{
        fetcher,
        // Revalidate on focus
        revalidateOnFocus: true,
        // Revalidate on network reconnect
        revalidateOnReconnect: true,
        // Refresh interval (optional, can be overridden per hook)
        refreshInterval: 0,
        // Error retry
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        // Deduplication interval
        dedupingInterval: 2000,
        // Focus throttle interval
        focusThrottleInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
}