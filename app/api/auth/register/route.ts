import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuthService, registrationSchema } from '@/services/auth';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validation = validateRequest(registrationSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.errors }, { status: 400 });
    }

    const { name, email, password, token, otp, subdomain } = validation.data;

    const conn = await connectDB(subdomain);

    const { success, message, data } = await AuthService.registerUser({
      conn,
      name,
      email,
      password,
      subdomain,
      token,
      otp,
    });

    if (!success) {
      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json({ message, data });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
