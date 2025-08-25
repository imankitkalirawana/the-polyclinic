// lib/permissions/index.ts
import { basePermissions } from './base';
import { organizationPermissions } from './organization';
import { PermissionConfig } from './types';

export const permissionsConfig: PermissionConfig = {
  ...basePermissions,
  ...organizationPermissions,
};
