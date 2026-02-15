import { GENDERS } from '@/libs/constants';
import {
  emailValidation,
  nameValidation,
  nullablePositiveNumberValidation,
  nullableStringValidation,
  phoneNumberValidation,
} from '@/utils/factories/validation.factory';

import { z } from 'zod';
import { Role } from './user.constants';

const userProfileUpdateSchema = z.object({
  role: z.enum(Role).readonly(),
  name: nameValidation,
  email: emailValidation,
  phone: phoneNumberValidation.optional(),
  image: nullableStringValidation,
});

export const doctorProfileUpdateSchema = z.object({
  specializations: nullableStringValidation.array(),
  designation: nullableStringValidation,
  experience: nullablePositiveNumberValidation,
  education: nullableStringValidation,
  biography: nullableStringValidation,
  seating: nullableStringValidation,
});

const patientProfileUpdateSchema = z.object({
  gender: z.enum(GENDERS).nullable().optional(),
  dob: z.iso.datetime().nullable().optional(),
  address: nullableStringValidation,
});

export const userFormValuesSchema = z.object({
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
