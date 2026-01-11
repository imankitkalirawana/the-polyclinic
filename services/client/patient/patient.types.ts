import { z } from 'zod';
import { newPatientSchema } from './patient.validation';
import { Base, Gender } from '@/types';

export interface PatientType extends Base {
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: Gender;
  age?: number;
  address?: string | null;
}

export type NewPatientRequest = z.infer<typeof newPatientSchema>;
