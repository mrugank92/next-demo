import { ZodError, ZodSchema } from 'zod';

/**
 * Validates data against a Zod schema and returns the result
 */
export function validateData<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _error: 'Validation failed' } };
  }
}

/**
 * Safely validates data and returns the parsed result or null
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): T | null {
  try {
    return schema.parse(data);
  } catch {
    return null;
  }
}

/**
 * Formats Zod errors for display
 */
export function formatZodErrors(error: ZodError): string[] {
  return error.errors.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}