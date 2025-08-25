import { UnifiedUserType } from '@/types';

// lib/permissions.ts
const API_VERSION = 'v1';
const API_BASE = `/api/${API_VERSION}`;

export type PermissionConfig = {
  [route: string]: {
    [method in 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH']?: UnifiedUserType['role'][];
  };
};

export const permissionsConfig: PermissionConfig = {
  [API_BASE]: {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
  [`${API_BASE}/organizations`]: {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
  [`${API_BASE}/users`]: {
    GET: ['superadmin', 'moderator'],
    POST: ['superadmin'],
    DELETE: ['superadmin'],
  },
  // Add more routes here...
};
