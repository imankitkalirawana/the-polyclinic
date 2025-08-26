import { getUserModel } from '@/models/User';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSubdomain } from '@/auth/sub-domain';
import { verify, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface CustomJwtPayload extends JwtPayload {
  email: string;
  otp: string;
  type: 'register' | 'reset-password' | 'verify-email';
}

export const POST = async (req: Request) => {
  const subdomain = await getSubdomain();
  if (!subdomain) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 400 });
  }

  try {
    const conn = await connectDB(subdomain);
    const User = getUserModel(conn);

    const { email, password, token, otp } = await req.json();

    if (!token || !otp) {
      return NextResponse.json({ error: 'Token and OTP are required' }, { status: 400 });
    }

    const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as CustomJwtPayload;

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (decoded.email !== email || decoded.type !== 'register' || decoded.otp !== otp) {
      return NextResponse.json({ error: 'Invalid token or OTP' }, { status: 400 });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
