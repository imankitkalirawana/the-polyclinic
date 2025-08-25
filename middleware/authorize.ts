// lib/middleware/authorize.ts
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';
import { permissionsConfig } from '@/lib/permissions/api';
import { UnifiedUserType } from '@/types';

export async function authorize(request: NextAuthRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method as keyof (typeof permissionsConfig)[string];

  const routeConfig = permissionsConfig[pathname];

  // ✅ Public route if no config at all
  if (!routeConfig) return null;

  // ✅ Public route if method not listed
  const allowedRoles = routeConfig[method];
  if (!allowedRoles) return null;

  // 🔒 Requires auth if method has restrictions
  const user = request.auth?.user;
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role as UnifiedUserType['role'])) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  return null; // ✅ authorized
}
