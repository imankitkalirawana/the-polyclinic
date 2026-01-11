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

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
