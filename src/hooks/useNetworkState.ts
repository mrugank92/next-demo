"use client";

import { useState, useEffect, useCallback } from "react";

interface NetworkConnection {
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (event: string, handler: () => void) => void;
  removeEventListener?: (event: string, handler: () => void) => void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection;
  mozConnection?: NetworkConnection;
  webkitConnection?: NetworkConnection;
}

export interface NetworkState {
  isOnline: boolean;
  isOffline: boolean;
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
}

interface NetworkStateHook extends NetworkState {
  wasOffline: boolean;
  reconnected: boolean;
  clearReconnectedFlag: () => void;
}

export function useNetworkState(): NetworkStateHook {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  });
  
  const [wasOffline, setWasOffline] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  const updateNetworkState = useCallback(() => {
    const isOnline = navigator.onLine;
    const isOffline = !isOnline;

    // Get network connection info if available
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || 
                      nav.mozConnection || 
                      nav.webkitConnection;

    const newState: NetworkState = {
      isOnline,
      isOffline,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      saveData: connection?.saveData,
    };

    setNetworkState(newState);

    // Track offline/online transitions
    if (isOnline && wasOffline) {
      setReconnected(true);
    }
    
    if (isOffline && !wasOffline) {
      setWasOffline(true);
    }

    if (isOnline) {
      setWasOffline(false);
    }
  }, [wasOffline]);

  const clearReconnectedFlag = useCallback(() => {
    setReconnected(false);
  }, []);

  useEffect(() => {
    // Update state on mount
    updateNetworkState();

    // Set up event listeners
    const handleOnline = () => updateNetworkState();
    const handleOffline = () => updateNetworkState();
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for network connection changes if supported
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || 
                      nav.mozConnection || 
                      nav.webkitConnection;

    if (connection && connection.addEventListener) {
      connection.addEventListener("change", updateNetworkState);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      
      if (connection && connection.removeEventListener) {
        connection.removeEventListener("change", updateNetworkState);
      }
    };
  }, [updateNetworkState]);

  return {
    ...networkState,
    wasOffline,
    reconnected,
    clearReconnectedFlag,
  };
}