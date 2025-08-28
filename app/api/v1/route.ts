import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const conn = await connectDB();

  return NextResponse.json({ message: conn.name });
}
