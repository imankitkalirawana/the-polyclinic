import { z } from 'zod';
import { createPatientSchema } from './validation';

// TODO: Remove this
export interface NewPatientFormValues {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  age?: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export type CreatePatient = z.infer<typeof createPatientSchema>;
