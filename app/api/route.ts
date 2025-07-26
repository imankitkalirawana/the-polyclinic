import { NextResponse } from 'next/server';

import client from '@/lib/db';

export const GET = async function GET() {
  try {
    await client.connect();
    return NextResponse.json({ message: 'Database Connected' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = async function POST(request: any) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: 'POST request', body });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
