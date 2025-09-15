"use client";

import { useEffect } from "react";
import { useNetworkState } from "./useNetworkState";
import { offlineStorage } from "@/lib/offlineStorage";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";

export function useOfflineSync() {
  const { isOnline, reconnected, clearReconnectedFlag } = useNetworkState();
  const { mutate } = useSWRConfig();

  // Sync when coming back online
  useEffect(() => {
    let syncTimeout: NodeJS.Timeout;

    if (reconnected && isOnline) {
      // Small delay to ensure connection is stable
      syncTimeout = setTimeout(async () => {
        try {
          const pendingActions = await offlineStorage.getPendingActions();
          
          if (pendingActions.length > 0) {
            const toastId = toast.info(`🔄 Syncing ${pendingActions.length} offline actions...`, {
              position: "top-right",
              autoClose: false,
              hideProgressBar: false,
            });

            const result = await offlineStorage.syncPendingActions();
            
            toast.dismiss(toastId);
            
            if (result.success > 0) {
              toast.success(`✅ Successfully synced ${result.success} actions`, {
                position: "top-right",
                autoClose: 3000,
              });
              
              // Revalidate all movie data after successful sync
              await mutate(
                (key) => typeof key === "string" && key.startsWith("/api/movies"),
                undefined,
                { revalidate: true }
              );
            }
            
            if (result.failed > 0) {
              toast.warning(`⚠️ Failed to sync ${result.failed} actions. Will retry later.`, {
                position: "top-right",
                autoClose: 5000,
              });
            }
          }
          
          clearReconnectedFlag();
        } catch (error) {
          console.error("Offline sync failed:", error);
          toast.error("Failed to sync offline changes", {
            position: "top-right",
            autoClose: 5000,
          });
          clearReconnectedFlag();
        }
      }, 1000);
    }

    return () => {
      if (syncTimeout) clearTimeout(syncTimeout);
    };
  }, [reconnected, isOnline, mutate, clearReconnectedFlag]);

  return {
    isOnline,
    syncOfflineData: async () => {
      if (isOnline) {
        return await offlineStorage.syncPendingActions();
      }
      return { success: 0, failed: 0 };
    },
    getStorageInfo: () => offlineStorage.getStorageInfo(),
  };
}