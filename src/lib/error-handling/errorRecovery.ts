export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: Error) => boolean;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attemptCount: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryCondition: (error: Error) => {
    // Retry network errors and 5xx server errors
    return (
      error.message.includes("network") ||
      error.message.includes("fetch") ||
      error.message.includes("timeout") ||
      error.message.includes("5")
    );
  },
};

export class ErrorRecovery {
  /**
   * Retry an async operation with exponential backoff
   */
  public static async retryAsync<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;
    let attemptCount = 0;

    while (attemptCount <= finalConfig.maxRetries) {
      try {
        const data = await operation();
        return {
          success: true,
          data,
          attemptCount: attemptCount + 1,
        };
      } catch (error) {
        lastError = error as Error;
        attemptCount++;

        // Don't retry if we've exceeded max retries
        if (attemptCount > finalConfig.maxRetries) {
          break;
        }

        // Don't retry if condition is not met
        if (finalConfig.retryCondition && !finalConfig.retryCondition(lastError)) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(finalConfig.backoffMultiplier, attemptCount - 1),
          finalConfig.maxDelay
        );

        // Add jitter to prevent thundering herd
        const jitteredDelay = delay + Math.random() * 1000;

        console.warn(`Retry attempt ${attemptCount}/${finalConfig.maxRetries} after ${jitteredDelay}ms`, lastError);

        await this.delay(jitteredDelay);
      }
    }

    return {
      success: false,
      error: lastError!,
      attemptCount,
    };
  }

  /**
   * Create a retry wrapper for API calls
   */
  public static createRetryableAPI<T>(
    apiCall: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ) {
    return async (): Promise<T> => {
      const result = await this.retryAsync(apiCall, config);
      
      if (result.success && result.data !== undefined) {
        return result.data;
      }
      
      throw result.error || new Error("Retry failed");
    };
  }

  /**
   * Network connectivity checker
   */
  public static async checkNetworkConnectivity(): Promise<boolean> {
    if (typeof window === "undefined" || !window.navigator) {
      return true; // Assume connected on server
    }

    // Check navigator.onLine first (quick check)
    if (!window.navigator.onLine) {
      return false;
    }

    // Perform actual network test
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
        timeout: 5000,
      } as RequestInit);
      
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Progressive retry strategy for different error types
   */
  public static getRetryConfigForError(error: Error): Partial<RetryConfig> {
    const message = error.message.toLowerCase();

    // Network errors - aggressive retry
    if (message.includes("network") || message.includes("fetch failed")) {
      return {
        maxRetries: 5,
        baseDelay: 2000,
        backoffMultiplier: 1.5,
      };
    }

    // Timeout errors - moderate retry
    if (message.includes("timeout")) {
      return {
        maxRetries: 3,
        baseDelay: 3000,
        backoffMultiplier: 2,
      };
    }

    // Server errors (5xx) - conservative retry
    if (message.includes("500") || message.includes("502") || message.includes("503")) {
      return {
        maxRetries: 2,
        baseDelay: 5000,
        backoffMultiplier: 2,
      };
    }

    // Rate limiting (429) - wait longer
    if (message.includes("429") || message.includes("rate limit")) {
      return {
        maxRetries: 2,
        baseDelay: 10000,
        backoffMultiplier: 3,
      };
    }

    // Client errors (4xx) - don't retry by default
    return {
      maxRetries: 0,
      retryCondition: () => false,
    };
  }

  /**
   * Circuit breaker pattern implementation
   */
  public static createCircuitBreaker<T>(
    operation: () => Promise<T>,
    options: {
      failureThreshold: number;
      recoveryTimeout: number;
      monitoringPeriod: number;
    } = {
      failureThreshold: 5,
      recoveryTimeout: 30000,
      monitoringPeriod: 60000,
    }
  ) {
    let failureCount = 0;
    let lastFailureTime = 0;
    let state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

    return async (): Promise<T> => {
      const now = Date.now();

      // Reset failure count if monitoring period has passed
      if (now - lastFailureTime > options.monitoringPeriod) {
        failureCount = 0;
      }

      // Check circuit state
      if (state === "OPEN") {
        if (now - lastFailureTime > options.recoveryTimeout) {
          state = "HALF_OPEN";
        } else {
          throw new Error("Circuit breaker is OPEN");
        }
      }

      try {
        const result = await operation();
        
        // Success - reset circuit
        if (state === "HALF_OPEN") {
          state = "CLOSED";
          failureCount = 0;
        }
        
        return result;
      } catch (error) {
        failureCount++;
        lastFailureTime = now;

        // Trip circuit if threshold exceeded
        if (failureCount >= options.failureThreshold) {
          state = "OPEN";
        } else if (state === "HALF_OPEN") {
          state = "OPEN";
        }

        throw error;
      }
    };
  }

  /**
   * Graceful degradation helper
   */
  public static async withFallback<T, F>(
    primary: () => Promise<T>,
    fallback: () => Promise<F> | F,
    condition?: (error: Error) => boolean
  ): Promise<T | F> {
    try {
      return await primary();
    } catch (error) {
      const shouldUseFallback = condition ? condition(error as Error) : true;
      
      if (shouldUseFallback) {
        console.warn("Primary operation failed, using fallback:", error);
        return await fallback();
      }
      
      throw error;
    }
  }

  /**
   * Utility delay function
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debounced retry for rapid successive failures
   */
  public static createDebouncedRetry<T>(
    operation: () => Promise<T>,
    debounceMs: number = 1000
  ) {
    let timeoutId: NodeJS.Timeout;
    let pendingPromise: Promise<T> | null = null;

    return (): Promise<T> => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Return existing promise if one is pending
      if (pendingPromise) {
        return pendingPromise;
      }

      // Create new debounced promise
      pendingPromise = new Promise<T>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await operation();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
          }
        }, debounceMs);
      });

      return pendingPromise;
    };
  }
}

// Utility hooks for React components
export const useRetryableOperation = <T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<T | null>(null);

  const execute = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ErrorRecovery.retryAsync(operation, config);
      
      if (result.success && result.data !== undefined) {
        setData(result.data);
      } else {
        setError(result.error || new Error("Operation failed"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [operation, config]);

  return { execute, isLoading, error, data, retry: execute };
};

// Note: React import would need to be added when this is used in a React context
import React from "react";