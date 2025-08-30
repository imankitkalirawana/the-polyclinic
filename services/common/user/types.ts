import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './validation';
import { Base } from '@/types';
import { ORGANIZATION_USER_ROLES, SYSTEM_USER_ROLE, USER_STATUSES } from './constants';
import { ValuesOf } from '@/lib/utils';

export interface AuthUser {
  user?: {
    name: string;
    email: string;
    role: UnifiedUser['role'];
    id: string;
    uid: string;
    image: string;
  };
  expires?: string;
}

export type UnifiedUser = SystemUser | OrganizationUser;

export type SystemUser = Base & {
  uid: string;
  email: string;
  name: string;
  role: SystemUserRole;
  status: UserStatus;
  phone?: string;
  image?: string;
  password?: string;
};

export type OrganizationUser = Base & {
  uid: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  role: OrganizationUserRole;
  status: UserStatus;
};

export type UserStatus = ValuesOf<typeof USER_STATUSES>;
type SystemUserRole = ValuesOf<typeof SYSTEM_USER_ROLE>;
type OrganizationUserRole = ValuesOf<typeof ORGANIZATION_USER_ROLES>;

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
