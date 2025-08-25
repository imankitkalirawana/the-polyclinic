// lib/middleware/authorize.ts
import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';
import { permissionsConfig } from '@/lib/api-permissions';

export async function authorize(request: NextAuthRequest) {
  const user = request.auth?.user;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method as keyof (typeof permissionsConfig)[string];

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const allowedRoles = permissionsConfig[pathname]?.[method] || [];

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  return null; // ✅ means authorized
}
