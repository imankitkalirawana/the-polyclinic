import { z } from 'zod';
import { DEPARTMENT_STATUSES } from './department.constants';

export const MAX_DESCRIPTION_LENGTH = 2000;

export const createDepartmentSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(2, { error: 'Name is required' }),
  description: z
    .string()
    .min(10, { error: 'Description must be at least 5 characters long' })
    .max(MAX_DESCRIPTION_LENGTH, {
      error: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`,
    })
    .optional()
    .nullable()
    .or(z.literal('')),
  image: z.url({ error: 'Invalid image URL' }).optional().nullable().or(z.literal('')),
  features: z
    .array(
      z.object({
        name: z
          .string({ error: 'Feature name is required' })
          .min(1, { error: 'Feature name is required' }),
        description: z
          .string({ error: 'Feature description is required' })
          .min(1, { error: 'Feature description is required' })
          .optional()
          .nullable(),
      })
    )
    .default([])
    .optional()
    .nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial().extend({
  status: z
    .enum(Object.keys(DEPARTMENT_STATUSES), { error: 'Invalid status' })
    .optional()
    .nullable()
    .or(z.literal('')),
});
