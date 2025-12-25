import { cookies } from 'next/headers';
import { Session } from '@/types/session';
import { cache } from 'react';
import { apiRequest } from './axios';

export const getServerSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) return null;

  try {
    const res = await apiRequest<Session>({
      url: '/client/auth/session',
      method: 'GET',
    });

    return res.data;
  } catch (error) {
    return null;
  }
});
