import { z } from 'zod';

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  errors?: string[];
}

/**
 * Validate request data against a schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // result.error is a ZodError<T>
  const errors = result.error.issues.map((issue) => {
    return `${issue.path.join('.') || 'root'}: ${issue.message}`;
  });

  return { success: false, errors };
}
