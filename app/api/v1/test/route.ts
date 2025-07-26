import { NextResponse } from 'next/server';
import { NextAuthRequest } from 'next-auth';
import { getToken } from 'next-auth/jwt';

const key = process.env.NEXTAUTH_SECRET;

export const POST = async function POST(req: NextAuthRequest) {
  try {
    const decoded = await getToken({ req, secret: key });
    return NextResponse.json({ message: 'POST request', decoded, req });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};
