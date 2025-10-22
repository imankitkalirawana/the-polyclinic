import { z } from 'zod';
import { DEPARTMENT_STATUSES } from './constants';

export const createDepartmentSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(1, { error: 'Name is required' }),
  description: z
    .string({ error: 'Description is required' })
    .min(1, { error: 'Description is required' })
    .optional()
    .nullable()
    .or(z.literal('')),
  image: z.string({ error: 'Image is required' }).optional().nullable().or(z.literal('')),
  status: z
    .enum(Object.keys(DEPARTMENT_STATUSES), { error: 'Invalid status' })
    .default(DEPARTMENT_STATUSES.active),
  features: z
    .array(
      z.object({
        name: z.string({ error: 'Feature name is required' }),
        description: z.string({ error: 'Feature description is required' }),
      })
    )
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();
