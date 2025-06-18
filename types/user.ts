import { Base, Gender } from '@/lib/interface';

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked',
  deleted = 'deleted',
  unverified = 'unverified',
}

export enum UserRole {
  admin = 'admin',
  doctor = 'doctor',
  nurse = 'nurse',
  receptionist = 'receptionist',
  pharmacist = 'pharmacist',
  laboratorist = 'laboratorist',
  user = 'user',
}

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
    role: UserRole;
    date: string | Date;
    id: string;
    uid: number;
    image: string;
  };
  expires?: string;
}
