import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuthService } from '@/services/common/auth/auth-service';
import { verifyOTPSchema } from '@/services/common/auth/validation';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validation = validateRequest(verifyOTPSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const { email, otp, type, subdomain } = validation.data;

    if (type === 'register' && !subdomain) {
      return NextResponse.json(
        { message: 'Organization/subdomain is required for registration' },
        { status: 400 }
      );
    }

    const conn = await connectDB(subdomain);

    const { success, message, data } = await AuthService.verifyOTP({
      conn,
      email,
      otp,
      type,
    });

    if (!success) {
      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json({ message, data });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
