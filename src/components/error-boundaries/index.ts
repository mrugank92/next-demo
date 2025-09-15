export { BaseErrorBoundary } from "./BaseErrorBoundary";
export type { ErrorBoundaryProps, ErrorFallbackProps } from "./BaseErrorBoundary";

export { MovieErrorBoundary } from "./MovieErrorBoundary";
export { FormErrorBoundary } from "./FormErrorBoundary";
export { APIErrorBoundary } from "./APIErrorBoundary";

// Re-export error UI components
export { ErrorFallback } from "../error-ui/ErrorFallback";
export { RetryButton } from "../error-ui/RetryButton";
export { ErrorMessage } from "../error-ui/ErrorMessage";

// Re-export error handling utilities
export { errorLogger, createErrorContext, generateErrorId } from "../../lib/error-handling/errorLogger";
export { ErrorRecovery, useRetryableOperation } from "../../lib/error-handling/errorRecovery";
export { apiErrorHandler, APIError, isAPIError, createAPIResponse, handleAPIError } from "../../lib/error-handling/apiErrorHandler";
export type { APIErrorResponse, APISuccessResponse, APIResponse } from "../../lib/error-handling/apiErrorHandler";