import { NextResponse } from 'next/server';

export const GET = async function GET(request: any) {
  try {
    return NextResponse.json({ message: 'GET request' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
export const POST = async function POST(request: any, context: any) {
  try {
    const body = await request.json();
    console.log('body', body);
    return NextResponse.json({ message: 'POST request', body });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
