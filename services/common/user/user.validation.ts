import { GENDERS } from '@/libs/constants';
import {
  emailValidation,
  nameValidation,
  nullablePositiveNumberValidation,
  nullableStringValidation,
  phoneNumberValidation,
} from '@/utils/factories/validation.factory';

import { z } from 'zod';

const userProfileUpdateSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  phone: phoneNumberValidation.optional(),
  image: nullableStringValidation,
});

const doctorProfileUpdateSchema = z.object({
  designation: nullableStringValidation,
  department: nullableStringValidation,
  experience: nullablePositiveNumberValidation,
  education: nullableStringValidation,
  biography: nullableStringValidation,
  shortbio: nullableStringValidation,
});

const patientProfileUpdateSchema = z.object({
  gender: z.enum(GENDERS).nullable().optional(),
  age: nullablePositiveNumberValidation,
  address: nullableStringValidation,
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
