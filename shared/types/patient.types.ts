import { Base } from './common.types';
import { Gender, PatientVitals } from '../enums';

export type Patient = Base & {
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: Gender;
  dob?: string;
  age?: number;
  address?: string | null;
  vitals?: PatientVitals;
};
