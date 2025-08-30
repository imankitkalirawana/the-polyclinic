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
      .string({ error: 'Oh come on, everyone has a name — even Batman.' })
      .trim()
      .min(1, { error: "You can't seriously have an *empty* name, right?" }),

    email: z.email({ error: "That's not an email, that's a cry for help." }).trim(),

    phone: z
      .string({ error: "A phone number would be nice, unless you're still using pigeons." })
      .trim()
      .optional()
      .refine((phone) => {
        if (phone) {
          return z
            .string()
            .regex(/^[6-9]\d{9}$/, { error: 'That number looks faker than a scam call.' })
            .safeParse(phone).success;
        }
        return true;
      }),

    image: z
      .url({ error: "That's not a URL. Try again before we all cry." })
      .optional()
      .or(z.literal('')),

    password: z
      .string({ error: 'A password is required — unless you enjoy hackers having fun.' })
      .trim()
      .min(8, { error: "At least 8 characters, please. '123456' doesn't cut it." })
      .optional(),

    organization: z.string().trim().optional().or(z.literal('')).nullable(),

    role: z
      .enum(UNIFIED_USER_ROLES, {
        error: 'Pick a valid role, not something you dreamt up last night.',
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
      message: "That role doesn't belong here — it's like wearing flip-flops to a board meeting.",
      path: ['role'],
    }
  );

export const updateUserSchema = createUserSchema.partial().extend({
  status: z
    .enum(USER_STATUSES, {
      error: "User status can only be active, inactive, or blocked — not 'vibing'.",
    })
    .optional(),
});
