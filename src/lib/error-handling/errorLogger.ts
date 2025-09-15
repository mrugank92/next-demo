export interface ErrorContext {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  errorInfo?: {
    componentStack?: string;
  };
  errorId: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
}

export interface APIErrorContext extends ErrorContext {
  endpoint?: string;
  method?: string;
  statusCode?: number;
  requestId?: string;
  responseTime?: number;
}

export interface FormErrorContext extends ErrorContext {
  formType?: string;
  validationErrors?: Record<string, string>;
  formData?: Record<string, unknown>;
}

class ErrorLogger {
  private errorQueue: ErrorContext[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  constructor() {
    // Process any queued errors when page unloads
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.flushErrors();
      });

      // Process errors periodically
      setInterval(() => {
        this.processErrorQueue();
      }, this.BATCH_TIMEOUT);
    }
  }

  public logError(context: ErrorContext): void {
    // Add to queue
    this.errorQueue.push(context);

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", context);
    }

    // Process immediately if critical error or queue is full
    if (this.isCriticalError(context) || this.errorQueue.length >= this.BATCH_SIZE) {
      this.processErrorQueue();
    } else {
      // Schedule batch processing
      this.scheduleBatchProcessing();
    }
  }

  public logAPIError(context: APIErrorContext): void {
    const enhancedContext: APIErrorContext = {
      ...context,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
    };

    this.logError(enhancedContext);
  }

  public logFormError(context: FormErrorContext): void {
    // Sanitize form data (remove sensitive information)
    const sanitizedFormData = this.sanitizeFormData(context.formData || {});
    
    const enhancedContext: FormErrorContext = {
      ...context,
      formData: sanitizedFormData,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || "unknown",
    };

    this.logError(enhancedContext);
  }

  private isCriticalError(context: ErrorContext): boolean {
    const criticalPatterns = [
      "ChunkLoadError",
      "SecurityError",
      "ReferenceError",
      "TypeError: Cannot read prop"
    ];

    return criticalPatterns.some(pattern => 
      context.error.message.includes(pattern) || 
      context.error.name.includes(pattern)
    );
  }

  private scheduleBatchProcessing(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this.processErrorQueue();
    }, this.BATCH_TIMEOUT);
  }

  private async processErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      await this.sendErrorBatch(errors);
    } catch (sendError) {
      console.error("Failed to send error batch:", sendError);
      
      // Re-queue errors if sending failed (but limit retries)
      const retriedErrors = errors.map(error => ({
        ...error,
        retryCount: (error as ErrorContext & { retryCount?: number }).retryCount ? (error as ErrorContext & { retryCount?: number }).retryCount! + 1 : 1
      })).filter(error => (error as ErrorContext & { retryCount?: number }).retryCount! <= 3);

      this.errorQueue.unshift(...retriedErrors);
    }
  }

  private async sendErrorBatch(errors: ErrorContext[]): Promise<void> {
    // Only send in production or if explicitly enabled
    if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING) {
      return;
    }

    try {
      const response = await fetch("/api/error-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ errors }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.info(`Successfully sent ${errors.length} error(s) to logging service`);
    } catch (error) {
      console.error("Error reporting failed:", error);
      throw error;
    }
  }

  private flushErrors(): void {
    if (this.errorQueue.length > 0) {
      // Use sendBeacon for immediate sending on page unload
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const data = JSON.stringify({ errors: this.errorQueue });
        navigator.sendBeacon("/api/error-log", data);
      }
    }
  }

  private sanitizeFormData(formData: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = [
      "password",
      "token",
      "secret",
      "key",
      "authorization",
      "auth",
      "credential",
      "ssn",
      "credit",
      "card"
    ];

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(formData)) {
      const keyLower = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => keyLower.includes(field));

      if (isSensitive) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "string" && value.length > 1000) {
        // Truncate very long strings
        sanitized[key] = value.substring(0, 1000) + "... [TRUNCATED]";
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  public getQueueSize(): number {
    return this.errorQueue.length;
  }

  public clearQueue(): void {
    this.errorQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Utility functions
export const createErrorContext = (
  error: Error,
  errorId: string,
  additionalContext: Partial<ErrorContext> = {}
): ErrorContext => {
  return {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    errorId,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    url: typeof window !== "undefined" ? window.location.href : "",
    ...additionalContext,
  };
};

export const generateErrorId = (): string => {
  return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};