import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const key = process.env.NEXTAUTH_SECRET;

export const POST = async function POST(req: any) {
  try {
    const decoded = await getToken({ req, secret: key });
    console.log('Decoded JWT:', decoded);
    return NextResponse.json({ message: 'POST request', decoded, req });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
