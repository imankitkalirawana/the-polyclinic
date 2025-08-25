import { $FixMe } from '@/types';
import { auth } from '@/auth';
import { authorize } from '@/middleware/authorize';
import type { NextAuthRequest } from 'next-auth';

export function withAuth<T extends (...args: $FixMe[]) => $FixMe>(handler: T) {
  return auth(async (request: NextAuthRequest, context: Parameters<T>[1]) => {
    const authCheck = await authorize(request);
    if (authCheck) return authCheck;

    return handler(request, context);
  });
}
