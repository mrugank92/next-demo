"use client";

import { Movie } from "@/types/common";

const STORAGE_KEYS = {
  MOVIES: "offline_movies_cache",
  LAST_SYNC: "last_sync_timestamp",
  PENDING_ACTIONS: "pending_offline_actions",
} as const;

export interface PendingAction {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  data: Partial<Movie> | Record<string, unknown>;
  timestamp: number;
  movieId?: string;
}

export interface OfflineMovieData {
  movies: Movie[];
  totalData: number;
  page: number;
  timestamp: number;
}

class OfflineStorageManager {
  private isClient = typeof window !== "undefined";

  // Movies cache management
  async cacheMovies(data: OfflineMovieData): Promise<void> {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.warn("Failed to cache movies offline:", error);
    }
  }

  async getCachedMovies(): Promise<OfflineMovieData | null> {
    if (!this.isClient) return null;
    
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.MOVIES);
      if (!cached) return null;
      
      const data = JSON.parse(cached) as OfflineMovieData;
      
      // Check if cache is too old (24 hours)
      const cacheAge = Date.now() - data.timestamp;
      if (cacheAge > 24 * 60 * 60 * 1000) {
        this.clearMoviesCache();
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn("Failed to retrieve cached movies:", error);
      return null;
    }
  }

  async clearMoviesCache(): Promise<void> {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.MOVIES);
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.warn("Failed to clear movies cache:", error);
    }
  }

  // Pending actions management (for offline operations)
  async addPendingAction(action: Omit<PendingAction, "id" | "timestamp">): Promise<void> {
    if (!this.isClient) return;
    
    try {
      const pendingActions = await this.getPendingActions();
      const newAction: PendingAction = {
        ...action,
        id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      
      pendingActions.push(newAction);
      localStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(pendingActions));
    } catch (error) {
      console.warn("Failed to add pending action:", error);
    }
  }

  async getPendingActions(): Promise<PendingAction[]> {
    if (!this.isClient) return [];
    
    try {
      const pending = localStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      if (!pending) return [];
      
      return JSON.parse(pending) as PendingAction[];
    } catch (error) {
      console.warn("Failed to retrieve pending actions:", error);
      return [];
    }
  }

  async removePendingAction(actionId: string): Promise<void> {
    if (!this.isClient) return;
    
    try {
      const pendingActions = await this.getPendingActions();
      const filteredActions = pendingActions.filter(action => action.id !== actionId);
      localStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(filteredActions));
    } catch (error) {
      console.warn("Failed to remove pending action:", error);
    }
  }

  async clearPendingActions(): Promise<void> {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS);
    } catch (error) {
      console.warn("Failed to clear pending actions:", error);
    }
  }

  // Sync pending actions when coming back online
  async syncPendingActions(): Promise<{ success: number; failed: number }> {
    if (!this.isClient) return { success: 0, failed: 0 };
    
    const pendingActions = await this.getPendingActions();
    let success = 0;
    let failed = 0;

    for (const action of pendingActions) {
      try {
        await this.executePendingAction(action);
        await this.removePendingAction(action.id);
        success++;
      } catch (error) {
        console.warn(`Failed to sync action ${action.id}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }

  private async executePendingAction(action: PendingAction): Promise<void> {
    const { type, data, movieId } = action;
    
    switch (type) {
      case "CREATE":
        await fetch("/api/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        break;
        
      case "UPDATE":
        if (!movieId) throw new Error("Movie ID required for update");
        await fetch(`/api/movies/${movieId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        break;
        
      case "DELETE":
        if (!movieId) throw new Error("Movie ID required for delete");
        await fetch(`/api/movies/${movieId}`, {
          method: "DELETE",
        });
        break;
        
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  // Storage info
  async getStorageInfo(): Promise<{
    cachedMovies: number;
    pendingActions: number;
    lastSync: Date | null;
    storageUsed: number;
  }> {
    if (!this.isClient) {
      return {
        cachedMovies: 0,
        pendingActions: 0,
        lastSync: null,
        storageUsed: 0,
      };
    }
    
    const cachedMovies = await this.getCachedMovies();
    const pendingActions = await this.getPendingActions();
    const lastSyncStr = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    const lastSync = lastSyncStr ? new Date(parseInt(lastSyncStr)) : null;
    
    // Calculate storage usage (rough estimate)
    let storageUsed = 0;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) storageUsed += item.length;
      });
    } catch (error) {
      console.warn("Failed to calculate storage usage:", error);
    }
    
    return {
      cachedMovies: cachedMovies?.movies.length || 0,
      pendingActions: pendingActions.length,
      lastSync,
      storageUsed,
    };
  }
}

export const offlineStorage = new OfflineStorageManager();