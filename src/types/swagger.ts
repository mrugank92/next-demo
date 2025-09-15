/**
 * Type definitions for Swagger/OpenAPI specifications
 */

/**
 * OpenAPI 3.0 Specification
 * Based on the OpenAPI 3.0 standard structure
 */
export interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
    variables?: Record<string, {
      default: string;
      description?: string;
      enum?: string[];
    }>;
  }>;
  paths?: Record<string, Record<string, unknown>>;
  components?: {
    schemas?: Record<string, unknown>;
    responses?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    examples?: Record<string, unknown>;
    requestBodies?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown>;
    links?: Record<string, unknown>;
    callbacks?: Record<string, unknown>;
  };
  security?: Array<Record<string, string[]>>;
  tags?: Array<{
    name: string;
    description?: string;
    externalDocs?: {
      description?: string;
      url: string;
    };
  }>;
  externalDocs?: {
    description?: string;
    url: string;
  };
}