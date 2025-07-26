import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';

import client from '@/lib/db';

export const GET = async function GET() {
  try {
    await client.connect();
    return NextResponse.json({ message: 'Database Connected' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const POST = async function POST(request: NextAuthRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'POST request', body });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};
