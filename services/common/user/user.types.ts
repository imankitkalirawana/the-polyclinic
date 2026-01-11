import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.validation';
import { Base } from '@/types';
import { Role, UserStatus } from './user.constants';

export type UserType = Base & {
  email: string;
  name: string;
  status: UserStatus;
  phone?: string;
  image?: string;
  role: Role;
};

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
