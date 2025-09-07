import { z } from 'zod';
import { ORGANIZATION_STATUSES } from './constants';

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, { error: 'Name cannot be empty' })
    .max(100, { error: 'Name cannot exceed 100 characters' }),
  domain: z
    .string({ error: 'Domain is required' })
    .trim()
    .toLowerCase()
    .min(1, { error: 'Domain cannot be empty' })
    .regex(/^[a-z0-9.-]+$/, {
      error: 'Domain must contain only lowercase letters, numbers, dots, and hyphens',
    }),
  logoUrl: z.url({ error: 'Logo URL must be a valid URL' }).optional().or(z.literal('')),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().extend({
  status: z
    .enum(ORGANIZATION_STATUSES, { error: 'Organization can be either active or inactive' })
    .optional(),
});
