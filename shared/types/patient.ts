import { Base } from './common';
import { Gender } from '../enums';

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
};
