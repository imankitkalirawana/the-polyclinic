import { GENDERS } from '@/lib/constants';
import { z } from 'zod';

const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: 'Name cannot be empty.' })
    .max(50, { error: 'Name cannot be more than 50 characters.' }),
  email: z.email({ error: 'Invalid email address.' }).trim(),
  phone: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined) return;
      if (val.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number must be 10 digits.',
        });
        return;
      }
      if (!/^[6-9]\d{9}$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid phone number.',
        });
      }
    }),
  image: z.string().trim().nullable().optional(),
});

const doctorProfileUpdateSchema = z.object({
  designation: z.string().trim().min(1, { error: 'Designation cannot be empty.' }),
  department: z.string().trim().min(1, { error: 'Department cannot be empty.' }),
  experience: z
    .number({ error: 'Experience must be a number.' })
    .int({ error: 'Experience must be a number.' })
    .positive({ error: 'Experience must be a positive number.' })
    .nullable()
    .optional(),
  education: z.string().trim().nullable().optional(),
  biography: z.string().trim().nullable().optional(),
  shortbio: z.string().trim().nullable().optional(),
});

const patientProfileUpdateSchema = z.object({
  gender: z.enum(GENDERS).nullable().optional(),
  age: z.number().int().positive().nullable().optional(),
  address: z.string().trim().nullable().optional(),
});

export const updateUserSchema = z.object({
  user: userProfileUpdateSchema,
  doctor: doctorProfileUpdateSchema.optional(),
  patient: patientProfileUpdateSchema.optional(),
});

export const resetPasswordSchema = z.object({
  password: z
    .string({ error: 'Password is required.' })
    .trim()
    .min(8, { error: 'Password must be at least 8 characters long.' }),
});
