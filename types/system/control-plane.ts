import { Base } from '@/lib/interface';
import { ValuesOf } from '@/lib/utils';
import { UnifiedUserRole } from '..';

export const systemUserStatuses = ['active', 'inactive', 'blocked'] as const;
export const systemUserRoles = ['superadmin', 'moderator', 'ops'] as const;

export type SystemUserType = Base & {
  uid: string;
  email: string;
  name: string;
  role: SystemUserRole;
  status: SystemUserStatus;
  phone?: string;
  image?: string;
  password?: string;
};

export interface AuthUser {
  user?: {
    name: string;
    email: string;
    role: UnifiedUserRole;
    id: string;
    uid: string;
    image: string;
  };
  expires?: string;
}

export type CreateUserType = Pick<
  SystemUserType,
  'email' | 'phone' | 'name' | 'role' | 'status' | 'image' | 'password'
>;

export type SystemUserStatus = ValuesOf<typeof systemUserStatuses>;
export type SystemUserRole = ValuesOf<typeof systemUserRoles>;
