import { z } from 'zod';
import { createPatientSchema } from './patient.validation';
import { Base, Gender } from '@/types';

// TODO: Remove this
export interface NewPatientFormValues {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  age?: number;
  address?: string;
}

export interface PatientType extends Base {
  id: string;
  userid: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: Gender;
  age?: number;
  address?: string | null;
}

export type CreatePatient = z.infer<typeof createPatientSchema>;
