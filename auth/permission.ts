import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  project: ['create', 'share', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

export const admin = ac.newRole({
  project: ['create', 'update'],
  ...adminAc.statements,
});

export const member = ac.newRole({
  project: ['create'],
});

export const owner = ac.newRole({
  project: ['create', 'update', 'delete'],
});

export const ops = ac.newRole({
  project: ['create', 'update', 'delete'],
  organization: ['update'],
});
