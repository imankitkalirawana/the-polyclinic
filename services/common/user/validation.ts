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
    name: z.string({ error: 'Name is required' }).trim().min(1, { error: 'Name cannot be empty' }),
    email: z.email({ error: 'Invalid email address' }).trim(),
    phone: z
      .string({ error: 'Phone is required' })
      .trim()
      .optional()
      .refine((phone) => {
        if (phone) {
          return z
            .string()
            .regex(/^[6-9]\d{9}$/, { error: 'Invalid phone number' })
            .safeParse(phone).success;
        }
        return true;
      }),
    image: z.url({ error: 'Image URL must be a valid URL' }).optional().or(z.literal('')),
    password: z
      .string({ error: 'Password is required' })
      .trim()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .optional(),
    organization: z.string({ error: 'Organization ID is required' }).trim().optional(),
    role: z.enum(UNIFIED_USER_ROLES).optional(),
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
      message: 'Invalid role for given organization',
      path: ['role'],
    }
  );

export const updateUserSchema = createUserSchema.partial().extend({
  status: z
    .enum(USER_STATUSES, { error: 'User can be either active, inactive or blocked' })
    .optional(),
});
