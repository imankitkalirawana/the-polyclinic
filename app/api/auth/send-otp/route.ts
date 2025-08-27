import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuthService } from '@/services/auth/auth-service';
import { sendOTPSchema } from '@/services/auth/validation';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validation = validateRequest(sendOTPSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: validation.errors },
        { status: 400 }
      );
    }

    const { email, type, subdomain } = validation.data;

    if (type === 'register' && !subdomain) {
      return NextResponse.json(
        { message: 'Organization/subdomain is required for registration' },
        { status: 400 }
      );
    }

    const conn = await connectDB(subdomain);

    const result = await AuthService.sendOTP({
      conn,
      email,
      type,
      subdomain,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to send OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
