import { z } from 'zod';
import { createUserSchema, updateUserSchema } from './user.validation';
import { Base } from '@/types';
import { ORGANIZATION_USER_ROLES, SYSTEM_USER_ROLE, USER_STATUSES } from './user.constants';
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

type UserBase = Base & {
  uid: string;
  email: string;
  name: string;
  status: UserStatus;
  phone?: string;
  image?: string;
};

// Specific user types
export type SystemUser = UserBase & {
  kind: 'system';
  role: SystemUserRole;
};

export type OrganizationUser = UserBase & {
  kind: 'organization';
  role: OrganizationUserRole;
  organization: string;
};

// Unified user type
export type UnifiedUser = SystemUser | OrganizationUser;

export type UserStatus = ValuesOf<typeof USER_STATUSES>;
type SystemUserRole = ValuesOf<typeof SYSTEM_USER_ROLE>;
type OrganizationUserRole = ValuesOf<typeof ORGANIZATION_USER_ROLES>;

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
