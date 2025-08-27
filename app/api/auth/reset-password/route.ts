import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { AuthService } from '@/services/auth/auth-service';
import { resetPasswordSchema } from '@/services/auth/validation';
import { validateRequest } from '@/services';

export const POST = async (req: NextRequest) => {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(resetPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const { email, password, token, otp, subdomain: requestSubdomain } = validation.data;

    // Get subdomain from request or fallback to organization subdomain
    const orgSubdomain = await getSubdomain();
    const subdomain = requestSubdomain || orgSubdomain || undefined;

    // Connect to database - use default connection if no subdomain
    const conn = subdomain ? await connectDB(subdomain) : await connectDB();

    // Use AuthService to reset password
    const result = await AuthService.resetPassword({
      conn,
      email,
      password,
      token,
      otp,
      subdomain: requestSubdomain || subdomain || 'default',
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to reset password' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message || 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
