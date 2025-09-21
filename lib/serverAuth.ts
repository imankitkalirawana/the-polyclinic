import { cache } from 'react';
import { cookies } from 'next/headers';
import { Session } from '@/types/session';
import { apiRequest } from './axios';

export const getServerSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) return null;

  try {
    console.log('sessionCookie', sessionCookie);
    const res = await apiRequest<Session>({
      url: '/auth/session',
    });

    console.log('res', res);

    return res.data ?? null;
  } catch (error) {
    return null;
  }
});
