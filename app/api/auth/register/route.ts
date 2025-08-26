import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { AuthService } from '@/services/auth';
import { registrationSchema, validateRequest } from '@/services/auth/validation';

export const POST = async (req: NextRequest) => {
  try {
    // Get subdomain
    const subdomain = await getSubdomain();
    if (!subdomain) {
      return NextResponse.json({ message: 'Organization not found' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateRequest(registrationSchema, body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const { email, password, token, otp } = validation.data;

    // Connect to database
    const conn = await connectDB(subdomain);

    // Use AuthService to register user
    const result = await AuthService.registerUser(conn, email, password, token, otp, subdomain);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message || 'Failed to register user' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message || 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
