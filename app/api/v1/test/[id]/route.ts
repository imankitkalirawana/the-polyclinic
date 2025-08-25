import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { NextAuthRequest } from 'next-auth';

type Params = Promise<{
  id: string;
}>;

export const GET = withAuth(async (request: NextAuthRequest, { params }: { params: Params }) => {
  const { id } = await params;
  console.log('id', id);
  return NextResponse.json({
    message: 'Hello, this is a dynamic test route!',
    user: request.auth?.user,
  });
});
