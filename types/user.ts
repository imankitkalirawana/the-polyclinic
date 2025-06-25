import { Base, Gender } from '@/lib/interface';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'blocked'
  | 'deleted'
  | 'unverified';

export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'laboratorist'
  | 'user';

export interface UserType extends Base {
  uid: number;
  email: string;
  date: string | Date;
  phone: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  state: string;
  city: string;
  address: string;
  zipcode: string;
  passwordResetToken: string;
  dob: string;
  gender: Gender;
  image: string;
}

export interface AuthUser {
  user?: {
    name: string;
    email: string;
    role: UserType['role'];
    date: string | Date;
    id: string;
    uid: number;
    image: string;
  };
  expires?: string;
}
