import { errorLogger, createErrorContext, generateErrorId } from "./errorLogger";
import { ErrorRecovery } from "./errorRecovery";

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
  };
}

export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;

export class APIError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly details?: unknown;
  public readonly endpoint?: string;
  public readonly method?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    retryable: boolean = false,
    details?: unknown,
    endpoint?: string,
    method?: string
  ) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.details = details;
    this.endpoint = endpoint;
    this.method = method;
  }

  static fromResponse(
    response: Response,
    responseData?: unknown,
    endpoint?: string
  ): APIError {
    const statusCode = response.status;
    const retryable = statusCode >= 500 || statusCode === 429;
    
    let code = "UNKNOWN_ERROR";
    let message = "An unexpected error occurred";

    // Determine error code and message based on status
    switch (statusCode) {
      case 400:
        code = "VALIDATION_ERROR";
        message = "Invalid request data";
        break;
      case 401:
        code = "AUTH_ERROR";
        message = "Authentication required";
        break;
      case 403:
        code = "PERMISSION_ERROR";
        message = "Permission denied";
        break;
      case 404:
        code = "NOT_FOUND";
        message = "Resource not found";
        break;
      case 409:
        code = "CONFLICT_ERROR";
        message = "Resource conflict";
        break;
      case 413:
        code = "PAYLOAD_TOO_LARGE";
        message = "Request payload too large";
        break;
      case 429:
        code = "RATE_LIMIT_ERROR";
        message = "Too many requests";
        break;
      case 500:
        code = "SERVER_ERROR";
        message = "Internal server error";
        break;
      case 502:
        code = "BAD_GATEWAY";
        message = "Bad gateway";
        break;
      case 503:
        code = "SERVICE_UNAVAILABLE";
        message = "Service unavailable";
        break;
      case 504:
        code = "GATEWAY_TIMEOUT";
        message = "Gateway timeout";
        break;
    }

    // Use response data if available
    if (responseData && typeof responseData === 'object' && 'error' in responseData) {
      const errorData = responseData as { error: { code?: string; message?: string; details?: unknown } };
      code = errorData.error.code || code;
      message = errorData.error.message || message;
    }

    return new APIError(
      message,
      code,
      statusCode,
      retryable,
      (responseData && typeof responseData === 'object' && 'error' in responseData && responseData.error && typeof responseData.error === 'object' && 'details' in responseData.error) ? (responseData.error as { details?: unknown }).details : undefined,
      endpoint,
      response.url
    );
  }

  static fromNetworkError(error: Error, endpoint?: string, method?: string): APIError {
    return new APIError(
      "Network error occurred",
      "NETWORK_ERROR",
      0,
      true,
      { originalError: error.message },
      endpoint,
      method
    );
  }
}

export class APIErrorHandler {
  private static instance: APIErrorHandler;

  public static getInstance(): APIErrorHandler {
    if (!APIErrorHandler.instance) {
      APIErrorHandler.instance = new APIErrorHandler();
    }
    return APIErrorHandler.instance;
  }

  /**
   * Enhanced fetch wrapper with error handling
   */
  public async fetchWithErrorHandling<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const method = options.method || "GET";
    const startTime = Date.now();

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const responseTime = Date.now() - startTime;
      let responseData: unknown;

      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        const apiError = APIError.fromResponse(response, responseData, endpoint);
        
        // Log API error
        this.logAPIError(apiError, {
          endpoint,
          method,
          responseTime,
          requestId: response.headers.get("x-request-id") || undefined,
        });

        throw apiError;
      }

      // Handle success response
      if (responseData && typeof responseData === 'object' && 'success' in responseData && responseData.success === false) {
        const errorData = responseData as { success: false; error: { message: string; code: string; retryable?: boolean; details?: unknown } };
        const apiError = new APIError(
          errorData.error.message,
          errorData.error.code,
          response.status,
          errorData.error.retryable || false,
          errorData.error.details,
          endpoint,
          method
        );

        this.logAPIError(apiError, {
          endpoint,
          method,
          responseTime,
          requestId: response.headers.get("x-request-id") || undefined,
        });

        throw apiError;
      }

      return (responseData as APIResponse<T>) || { success: true, data: null };

    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Handle network errors
      const networkError = APIError.fromNetworkError(error as Error, endpoint, method);
      
      this.logAPIError(networkError, {
        endpoint,
        method,
        responseTime: Date.now() - startTime,
      });

      throw networkError;
    }
  }

  /**
   * Retryable fetch with automatic retry logic
   */
  public async fetchWithRetry<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig?: Parameters<typeof ErrorRecovery.retryAsync>[1]
  ): Promise<APIResponse<T>> {
    const operation = () => this.fetchWithErrorHandling<T>(endpoint, options);
    
    const result = await ErrorRecovery.retryAsync(operation, {
      ...retryConfig,
      retryCondition: (error: Error) => {
        if (error instanceof APIError) {
          return error.retryable;
        }
        return retryConfig?.retryCondition?.(error) ?? true;
      },
    });

    if (result.success && result.data) {
      return result.data;
    }

    throw result.error;
  }

  /**
   * Create a standardized error response
   */
  public createErrorResponse(
    code: string,
    message: string,
    details?: unknown,
    retryable: boolean = false
  ): APIErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
        retryable,
      },
    };
  }

  /**
   * Get user-friendly error message
   */
  public getUserFriendlyMessage(error: APIError): string {
    switch (error.code) {
      case "VALIDATION_ERROR":
        return "Please check your input and try again.";
      case "AUTH_ERROR":
        return "Please sign in to continue.";
      case "PERMISSION_ERROR":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND":
        return "The requested item could not be found.";
      case "CONFLICT_ERROR":
        return "This action conflicts with existing data.";
      case "PAYLOAD_TOO_LARGE":
        return "The file you're trying to upload is too large.";
      case "RATE_LIMIT_ERROR":
        return "You're doing that too often. Please wait a moment.";
      case "NETWORK_ERROR":
        return "Connection error. Please check your internet and try again.";
      case "SERVER_ERROR":
      case "BAD_GATEWAY":
      case "SERVICE_UNAVAILABLE":
      case "GATEWAY_TIMEOUT":
        return "Server error. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  /**
   * Check if error should show retry button
   */
  public shouldShowRetry(error: APIError): boolean {
    return error.retryable || error.code === "NETWORK_ERROR";
  }

  /**
   * Get appropriate retry delay for error type
   */
  public getRetryDelay(error: APIError): number {
    switch (error.code) {
      case "RATE_LIMIT_ERROR":
        return 30000; // 30 seconds
      case "SERVER_ERROR":
      case "BAD_GATEWAY":
      case "SERVICE_UNAVAILABLE":
        return 10000; // 10 seconds
      case "GATEWAY_TIMEOUT":
        return 5000; // 5 seconds
      default:
        return 2000; // 2 seconds
    }
  }

  private logAPIError(
    error: APIError,
    context: {
      endpoint: string;
      method: string;
      responseTime: number;
      requestId?: string;
    }
  ): void {
    const errorId = generateErrorId();
    const errorContext = createErrorContext(error, errorId);

    errorLogger.logAPIError({
      ...errorContext,
      endpoint: context.endpoint,
      method: context.method,
      statusCode: error.statusCode,
      requestId: context.requestId,
      responseTime: context.responseTime,
    });
  }
}

// Singleton instance
export const apiErrorHandler = APIErrorHandler.getInstance();

// Utility functions
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

export const createAPIResponse = <T>(data: T): APISuccessResponse<T> => ({
  success: true,
  data,
});

export const handleAPIError = (error: unknown): APIErrorResponse => {
  if (isAPIError(error)) {
    return apiErrorHandler.createErrorResponse(
      error.code,
      error.message,
      error.details,
      error.retryable
    );
  }

  // Handle unknown errors
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return apiErrorHandler.createErrorResponse("UNKNOWN_ERROR", message);
};