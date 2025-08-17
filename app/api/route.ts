import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session);

  return NextResponse.json({ message: 'Hello, world!' });
}
