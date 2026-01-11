import { z } from 'zod';
import { ORGANIZATION_STATUSES } from './organization.constants';

export const createOrganizationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, { error: 'Name cannot be empty' })
    .max(100, { error: 'Name cannot exceed 100 characters' }),
  organizationId: z
    .string({ error: 'Organization ID is required' })
    .trim()
    .min(1, { error: 'Organization ID cannot be empty' })
    .max(100, { error: 'Organization ID cannot exceed 100 characters' }),
  logoUrl: z.url({ error: 'Logo URL must be a valid URL' }).optional().or(z.literal('')),
  organizationDetails: z
    .object({
      location: z.url({ error: 'Invalid Location URL' }).optional().or(z.literal('')),
      address: z.string({ error: 'Invalid Address' }).optional().or(z.literal('')),
      phone: z.string({ error: 'Invalid Phone Number' }).optional().or(z.literal('')),
      email: z.string({ error: 'Invalid Email' }).optional().or(z.literal('')),
      website: z.string({ error: 'Invalid Website' }).optional().or(z.literal('')),
    })
    .optional(),
});

export const updateOrganizationSchema = createOrganizationSchema
  .omit({ organizationId: true })
  .partial()
  .extend({
    status: z
      .enum(ORGANIZATION_STATUSES, { error: 'Organization can be either active or inactive' })
      .optional(),
  });
