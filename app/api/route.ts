import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export const GET = async function GET() {
  try {
    await connectDB()
      .then(() => {
        return NextResponse.json({ message: 'Database Connected' });
      })
      .catch((error) => {
        return NextResponse.json({ message: error.message }, { status: 500 });
      });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
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
