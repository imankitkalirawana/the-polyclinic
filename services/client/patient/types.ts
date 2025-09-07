import { z } from 'zod';
import { createPatientSchema } from './validation';
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
  uid: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  gender: Gender;
  age?: number;
  address: string;
}

export type CreatePatient = z.infer<typeof createPatientSchema>;
