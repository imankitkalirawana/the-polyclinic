import { z } from 'zod';
import {
  ORGANIZATION_USER_ROLES,
  SYSTEM_USER_ROLE,
  UNIFIED_USER_ROLES,
  USER_STATUSES,
} from './constants';
import { GENDERS } from '@/lib/constants';

export const createUserSchema = z
  .object({
    name: z
      .string({ error: 'Name is required.' })
      .trim()
      .min(1, { error: 'Name cannot be empty.' }),

    email: z.string({ error: 'Invalid email address.' }).email().trim(),

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

    password: z
      .string({ error: 'Password is required.' })
      .trim()
      .min(8, { error: 'Password must be at least 8 characters long.' })
      .optional()
      .or(z.literal('')),

    organization: z.string().trim().optional().or(z.literal('')).nullable(),

    role: z.enum(UNIFIED_USER_ROLES, {
      error: 'Invalid role selected.',
    }),

    // Patient fields
    age: z.number().int().positive().max(120).optional().nullable(),
    address: z.string().max(200).optional().nullable().or(z.literal('')),
    dob: z.string().optional().nullable().or(z.literal('')),

    // Doctor fields
    specialization: z.string().max(200).optional().nullable().or(z.literal('')),
    experience: z.number().int().positive().optional().nullable(),
    department: z.string().max(200).optional().nullable().or(z.literal('')),
    designation: z.string().max(200).optional().nullable().or(z.literal('')),
    seating: z.string().max(200).optional().nullable().or(z.literal('')),
    education: z.string().max(200).optional().nullable().or(z.literal('')),
    biography: z.string().max(200).optional().nullable().or(z.literal('')),
    shortbio: z.string().max(200).optional().nullable().or(z.literal('')),

    // Common fields
    gender: z.enum(GENDERS).optional().nullable().or(z.literal('')), // doctor, patient
  })
  .refine(
    (data) => {
      if (data.organization) {
        return data.role
          ? ORGANIZATION_USER_ROLES.includes(data.role as (typeof ORGANIZATION_USER_ROLES)[number])
          : true;
      }
      return data.role
        ? SYSTEM_USER_ROLE.includes(data.role as (typeof SYSTEM_USER_ROLE)[number])
        : true;
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
