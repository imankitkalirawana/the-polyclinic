import {
  emailValidation,
  nameValidation,
  nullablePositiveNumberValidation,
  nullableStringValidation,
  passwordValidation,
  phoneNumberValidation,
} from '../factory.dto';

import { z } from 'zod';
import { UserRole, Gender, BloodType, AuthSource } from '../../enums';

const userProfileUpdateSchema = z.object({
  role: z.enum(UserRole),
  name: nameValidation,
  email: emailValidation,
  phone: phoneNumberValidation.optional().nullable(),
  image: nullableStringValidation,
  time_zone: nullableStringValidation,
  auth_source: z.enum(AuthSource).optional(),
  companies: z.array(z.string()).optional(),
  password: passwordValidation.optional(),
});

export const doctorProfileUpdateSchema = z.object({
  specializations: nullableStringValidation.array().optional(),
  designation: nullableStringValidation,
  experience: nullablePositiveNumberValidation,
  education: nullableStringValidation,
  biography: nullableStringValidation,
  seating: nullableStringValidation,
});

const vitalsSchema = z.object({
  bloodType: z
    .enum(BloodType, {
      error: 'Please select a valid blood type.',
    })
    .optional()
    .nullable(),
  bloodPressure: nullableStringValidation,
  heartRate: nullableStringValidation,
  weight: nullablePositiveNumberValidation,
  height: nullablePositiveNumberValidation,
  allergy: nullableStringValidation,
});

const createPatientProfileSchema = z.object({
  gender: z.enum(Gender).optional(),
  dob: z.coerce.date().optional(),
  address: nullableStringValidation,
  vitals: vitalsSchema.optional(),
});

export const createProfileSchema = z.object({
  user: userProfileUpdateSchema,
  doctor: doctorProfileUpdateSchema.optional(),
  patient: createPatientProfileSchema.optional(),
});

export type CreateProfileDto = z.input<typeof createProfileSchema>;
