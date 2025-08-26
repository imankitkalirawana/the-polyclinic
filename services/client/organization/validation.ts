import { organizationStatuses } from '@/types/system/organization';
import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name cannot exceed 100 characters'),
  domain: z
    .string({ error: 'Domain is required' })
    .trim()
    .min(1, 'Domain cannot be empty')
    .toLowerCase()
    .regex(
      /^[a-z0-9.-]+$/,
      'Domain must contain only lowercase letters, numbers, dots, and hyphens'
    ),
  logoUrl: z.url('Logo URL must be a valid URL').optional().or(z.literal('')),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().extend({
  status: z.enum(organizationStatuses).optional(),
});
