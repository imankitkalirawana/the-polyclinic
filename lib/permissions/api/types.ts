import { UnifiedUserType } from '@/types';

export type PermissionConfig = {
  [route: string]: {
    [method in 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH']?: UnifiedUserType['role'][];
  };
};
