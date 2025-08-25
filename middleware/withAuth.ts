import { $FixMe } from '@/types';
import { auth } from '@/auth';
import { authorize } from '@/middleware/authorize';

export function withAuth(handler: (req: $FixMe) => Promise<Response> | Response) {
  return auth(async (request: $FixMe) => {
    const authCheck = await authorize(request);
    if (authCheck) return authCheck;
    return handler(request);
  });
}
