import { z } from 'zod';
import { resetPasswordSchema, updateUserSchema } from './user.validation';
import { Base } from '@/types';
import { Role, UserStatus } from './user.constants';
import { DoctorType } from '@/services/client/doctor';
import { PatientType } from '@/services/client/patient';

export type UserType = Base & {
  email: string;
  name: string;
  status: UserStatus;
  phone?: string;
  image?: string;
  role: Role;
};

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export type UserProfileType = {
  user: UserType;
  doctor?: DoctorType;
  patient?: PatientType;
};
