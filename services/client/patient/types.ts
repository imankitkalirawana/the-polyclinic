import { z } from 'zod';
import { createPatientSchema } from './validation';
import { Gender } from '@/types';

// TODO: Remove this
export interface NewPatientFormValues {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  age?: number;
  address: string;
}

export type CreatePatient = z.infer<typeof createPatientSchema>;
