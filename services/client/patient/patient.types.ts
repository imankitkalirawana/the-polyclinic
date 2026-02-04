import { GENDERS } from '@/libs/constants';
import { Base } from '@/types';

export interface PatientType extends Base {
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: GENDERS;
  dob?: string;
  age?: number;
  address?: string | null;
}
