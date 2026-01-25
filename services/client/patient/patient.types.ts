import { GENDERS } from '@/lib/constants';
import { Base } from '@/types';

export interface PatientType extends Base {
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  phone: string;
  gender?: GENDERS;
  age?: number;
  address?: string | null;
}
