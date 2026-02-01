import { cookies } from 'next/headers';
import { Session } from '@/types/session';
import { cache } from 'react';
import { AuthApi } from '@/services/common/auth/auth.api';

export const getServerSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) return null;

  try {
    const res = await AuthApi.getSession();

    return res.data;
  } catch (error) {
    return null;
  }
});
