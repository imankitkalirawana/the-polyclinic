import { cache } from 'react';
import { cookies } from 'next/headers';
import { Session } from '@/types/session';
import { getSubdomain } from '@/auth/sub-domain';

export const getServerSession = cache(async (): Promise<Session | null> => {
  const subdomain = await getSubdomain();
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid')?.value;
  if (!sessionCookie) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session?organization=${subdomain}`,
      {
        headers: {
          Authorization: `Bearer ${sessionCookie}`,
        },
      }
    );

    const data = await res.json();
    console.log('serverAuth.ts: data', data?.data);
    return data?.data;
  } catch (error) {
    return null;
  }
});
