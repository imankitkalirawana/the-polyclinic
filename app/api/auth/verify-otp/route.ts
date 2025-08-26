import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { AuthService } from '@/services/auth/auth-service';
import { verifyOTPSchema } from '@/services/auth/validation';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    // Get subdomain
    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(verifyOTPSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const { email, otp, type } = validation.data;

    // Connect to database
    const conn = await connectDB(subdomain);

    // Use AuthService to verify OTP
    const result = await AuthService.verifyOTP(conn, email, otp, type);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to verify OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message || 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
};
