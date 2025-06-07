import { NextResponse } from 'next/server';
import client from '@/lib/db';

export const GET = async function GET() {
  try {
    try {
      await client.connect();
      console.log("MongoClient connected in app/api/route.ts GET");
      return NextResponse.json({ message: 'Database Connected' });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  } finally {
    await client.close();
    console.log("MongoClient closed in app/api/route.ts GET");
  }
};

export const POST = async function POST(request: any) {
  try {
    const body = await request.json();
    console.log('body', body);
    return NextResponse.json({ message: 'POST request', body });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
