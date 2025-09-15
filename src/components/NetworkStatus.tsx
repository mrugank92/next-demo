"use client";

import { useEffect } from "react";
import { useNetworkState } from "@/hooks/useNetworkState";
import { toast } from "react-toastify";

interface NetworkStatusProps {
  showToasts?: boolean;
  showIndicator?: boolean;
}

export default function NetworkStatus({ 
  showToasts = true, 
  showIndicator = true 
}: NetworkStatusProps) {
  const { isOnline, isOffline, reconnected, clearReconnectedFlag } = useNetworkState();

  // Show toast notifications for network changes
  useEffect(() => {
    if (!showToasts) return;

    if (reconnected) {
      toast.success("✅ Connection restored! Syncing data...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      // Clear the reconnected flag after showing toast
      setTimeout(clearReconnectedFlag, 100);
    }
  }, [reconnected, showToasts, clearReconnectedFlag]);

  useEffect(() => {
    if (!showToasts) return;

    if (isOffline) {
      toast.warning("⚠️ You're offline. Some features may be limited.", {
        position: "top-right",
        autoClose: false, // Keep offline notification until reconnected
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: "offline-status", // Prevent duplicate toasts
      });
    } else if (isOnline) {
      // Dismiss offline notification when back online
      toast.dismiss("offline-status");
    }
  }, [isOffline, isOnline, showToasts]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {isOffline && (
        <div
          className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded-lg shadow-lg animate-pulse"
          role="alert"
          aria-live="polite"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium">Offline</span>
        </div>
      )}
    </div>
  );
}