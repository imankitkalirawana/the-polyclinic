import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { AuthService } from '@/services/auth/auth-service';
import { verifyOTPSchema } from '@/services/auth/validation';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(verifyOTPSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const { email, otp, type, subdomain: requestSubdomain } = validation.data;

    // For registration, subdomain is required
    if (type === 'register' && !requestSubdomain) {
      return NextResponse.json(
        { message: 'Organization/subdomain is required for registration' },
        { status: 400 }
      );
    }

    // Get subdomain from request or fallback to organization subdomain
    const orgSubdomain = await getSubdomain();
    const subdomain = requestSubdomain || orgSubdomain || undefined;

    // Connect to database - use default connection for password reset if no subdomain
    const conn = subdomain ? await connectDB(subdomain) : await connectDB();

    // Use AuthService to verify OTP
    const result = await AuthService.verifyOTP({
      conn,
      email,
      otp,
      type,
    });

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
