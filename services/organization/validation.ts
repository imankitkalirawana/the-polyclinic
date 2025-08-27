import {
  organizationStatuses,
  organizationUserRoles,
  organizationUserStatuses,
} from '@/types/system/organization';
import { z } from 'zod';

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
    .enum(organizationStatuses, { error: 'Organization can be either active or inactive' })
    .optional(),
});

// Organization User

export const createOrganizationUserSchema = z.object({
  name: z.string({ error: 'Name is required' }).trim().min(1, { error: 'Name cannot be empty' }),
  email: z.email({ error: 'Invalid email address' }).trim(),
  phone: z
    .string({ error: 'Phone is required' })
    .trim()
    .min(1, { error: 'Phone cannot be empty' })
    .regex(/^[6-9]\d{9}$/, { error: 'Invalid phone number' })
    .optional(),
  image: z.url({ error: 'Image URL must be a valid URL' }).optional().or(z.literal('')),
  password: z
    .string({ error: 'Password is required' })
    .trim()
    .min(8, { error: 'Password must be at least 8 characters long' })
    .optional(),
  role: z.enum(organizationUserRoles, { error: 'Role is required' }).default('patient').optional(),
});

export const updateOrganizationUserSchema = createOrganizationUserSchema.partial().extend({
  status: z
    .enum(organizationUserStatuses, { error: 'User can be either active or inactive' })
    .optional(),
});

// TYPES

export type CreateOrganizationRequest = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationSchema>;

// Organization User

export type CreateOrganizationUserRequest = z.infer<typeof createOrganizationUserSchema>;
export type UpdateOrganizationUserRequest = z.infer<typeof updateOrganizationUserSchema>;
