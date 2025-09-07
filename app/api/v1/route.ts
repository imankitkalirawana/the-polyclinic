import { getSubdomain } from '@/auth/sub-domain';
import { NextResponse } from 'next/server';

export async function GET() {
  const subdomain = await getSubdomain();

  return NextResponse.json({ message: 'Hello', subdomain });
}
