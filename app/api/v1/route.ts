import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { NextAuthRequest } from 'next-auth';

export const GET = withAuth(async (request: NextAuthRequest) => {
  return NextResponse.json({ message: 'Hello, world!', user: request.auth?.user });
});
