// lib/middleware/authorize.ts
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';
import { permissionsConfig } from '@/lib/permissions/api';
import { UnifiedUserType } from '@/types';
import { match } from 'path-to-regexp';

export async function authorize(request: NextAuthRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method as keyof (typeof permissionsConfig)[string];

  // 🔍 Find the first matching route pattern
  const matchedEntry = Object.entries(permissionsConfig).find(([pattern]) => {
    const matcher = match(pattern, { decode: decodeURIComponent });
    return matcher(pathname);
  });

  if (!matchedEntry) return null; // ✅ public route if no pattern matched

  const [_, routeConfig] = matchedEntry;
  const allowedRoles = routeConfig[method];

  if (!allowedRoles) return null; // ✅ public if method not listed

  // 🔒 Requires auth if roles are defined
  const user = request.auth?.user;
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role as UnifiedUserType['role'])) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  return null; // ✅ authorized
}
