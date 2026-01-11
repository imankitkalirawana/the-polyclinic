import { z } from 'zod';
import { GENDERS } from '@/lib/constants';

export const newPatientSchema = z
  .object({
    userId: z.string().optional().nullable().or(z.literal('')),
    name: z.string().optional().nullable().or(z.literal('')),
    email: z.email().optional().nullable().or(z.literal('')),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, { error: 'Phone number must be a valid 10-digit number.' })
      .optional()
      .nullable()
      .or(z.literal('')),
    gender: z.enum(GENDERS).optional().nullable().or(z.literal('')),
    image: z.string().optional().nullable().or(z.literal('')),
    age: z
      .number({ error: 'Age must be a number.' })
      .min(0, { error: 'Age must be more than 0' })
      .max(120, { error: 'Age cannot exceed 120.' })
      .optional()
      .nullable()
      .or(z.literal('')),
    address: z.string().optional().nullable().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.userId) {
        return true;
      }
      // Case 2: name + email
      if (data.name && data.email) return true;

      // Case 3: name + phone
      if (data.name && data.phone) return true;

      return false;
    },
    {
      message: 'Either select an existing user, or provide a name with phone or email',
      path: ['phone'],
    }
  );
