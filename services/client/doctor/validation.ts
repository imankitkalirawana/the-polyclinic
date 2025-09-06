import { z } from 'zod';
import { createUserSchema } from '@/services/common/user';
import { GENDERS } from '@/lib/constants';

export const createPatientSchema = createUserSchema.extend({
  role: z.enum(['patient'], { error: 'Invalid role' }),
  gender: z.enum(GENDERS).optional().nullable().or(z.literal('')),
  age: z.number().min(0).max(120).optional().nullable().or(z.literal('')),
  address: z.string().max(200).optional().nullable().or(z.literal('')),
});

export const updatePatientSchema = createPatientSchema.partial();
