import { Base } from '@/lib/interface';
import { ValuesOf } from '@/lib/utils';

export const genders = ['male', 'female', 'other'] as const;

export const userStatuses = ['active', 'inactive', 'blocked', 'deleted', 'unverified'] as const;

export const userRoles = [
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'laboratorist',
  'user',
] as const;

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

export type CreateUserType = Pick<
  UserType,
  | 'email'
  | 'phone'
  | 'name'
  | 'role'
  | 'status'
  | 'country'
  | 'state'
  | 'zipcode'
  | 'gender'
  | 'dob'
  | 'address'
  | 'city'
  | 'image'
>;

export type Gender = ValuesOf<typeof genders>;
export type UserStatus = ValuesOf<typeof userStatuses>;
export type UserRole = ValuesOf<typeof userRoles>;
