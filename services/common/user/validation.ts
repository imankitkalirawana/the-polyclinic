import { z } from 'zod';
import {
  ORGANIZATION_USER_ROLES,
  SYSTEM_USER_ROLE,
  UNIFIED_USER_ROLES,
  USER_STATUSES,
} from './constants';
import { OrganizationUser, SystemUser } from './types';

export const createUserSchema = z
  .object({
    name: z
      .string({ error: 'Name is required.' })
      .trim()
      .min(1, { error: 'Name cannot be empty.' }),

    email: z.email({ error: 'Invalid email address.' }).trim(),

    phone: z
      .string({ error: 'Invalid phone number.' })
      .trim()
      .optional()
      .refine((phone) => {
        if (phone) {
          return z
            .string()
            .regex(/^[6-9]\d{9}$/, { error: 'Phone number must be a valid 10-digit number.' })
            .safeParse(phone).success;
        }
        return true;
      }),

    image: z.url({ error: 'Invalid URL format.' }).optional().or(z.literal('')),

    password: z
      .string({ error: 'Password is required.' })
      .trim()
      .min(8, { error: 'Password must be at least 8 characters long.' })
      .optional()
      .or(z.literal('')),

    organization: z.string().trim().optional().or(z.literal('')).nullable(),

    role: z
      .enum(UNIFIED_USER_ROLES, {
        error: 'Invalid role selected.',
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.organization) {
        return data.role
          ? ORGANIZATION_USER_ROLES.includes(data.role as OrganizationUser['role'])
          : true;
      }
      return data.role ? SYSTEM_USER_ROLE.includes(data.role as SystemUser['role']) : true;
    },
    {
      message: 'Role does not match the selected organization type.',
      path: ['role'],
    }
  );

export const updateUserSchema = createUserSchema.partial().extend({
  status: z
    .enum(USER_STATUSES, {
      error: "Invalid status. Allowed values are: 'active', 'inactive', or 'blocked'.",
    })
    .optional(),
});
