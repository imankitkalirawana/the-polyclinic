import { UnifiedUser } from '@/services/common/user';

export type PermissionConfig = {
  [route: string]: {
    [method in 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH']?: UnifiedUser['role'][];
  };
};
