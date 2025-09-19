import { cookies } from 'next/headers';
import { axios } from './axios';
import { Session } from '@/types/session';

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;

  if (!sessionCookie) return null;

  try {
    const { data }: { data: Session | null } = await axios.get(`/auth/session`, {
      headers: {
        Cookie: `connect.sid=${sessionCookie}`, // Forward cookie
      },
    });

    return data;
  } catch (error) {
    return null;
  }
}
