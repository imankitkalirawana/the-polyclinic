import { cookies } from 'next/headers';
import { Session } from '@/types/session';
import { apiRequest } from './axios';

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) return null;

  try {
    const res = await apiRequest<Session>({
      url: '/auth/session',
      method: 'GET',
    });

    if (res.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}
