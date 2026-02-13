import { GENDERS } from '@/libs/constants';
import { Base } from '@/types';

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  UNKNOWN = 'Unknown',
}

export interface PatientType extends Base {
  user_id: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: GENDERS;
  age?: number;
  address?: string | null;
  vitals?: Vitals;
}

export type Vitals = {
  bloodType?: BloodType;
  bloodPressure?: string | null;
  heartRate?: number | null;
  allergies?: string | null;
  diseases?: string | null;
  height?: number | null;
  weight?: number | null;
};
