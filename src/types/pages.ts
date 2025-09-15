/**
 * Type definitions for Next.js page components
 */

/**
 * Props for dynamic route pages with params
 */
export interface PageProps<T extends Record<string, string | string[]> = Record<string, string | string[]>> {
  params: Promise<T>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Props for edit page component
 */
export interface EditPageParams {
  locale: string;
  id: string;
}